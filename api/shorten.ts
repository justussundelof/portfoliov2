// api/shorten.ts (Vercel serverless function)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { customAlphabet } from 'nanoid';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // always return JSON content-type
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { url } = req.body as { url?: string };
        if (!url) return res.status(400).json({ error: 'Missing url' });

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // ensure Upstash credentials exist
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            return res.status(500).json({ error: 'Server not configured (missing UPSTASH env vars)' });
        }

        // generate id (avoid collisions)
        let id = nanoid();
        let exists = await redis.get(`u:${id}`);
        let tries = 0;
        while (exists && tries < 5) {
            id = nanoid();
            exists = await redis.get(`u:${id}`);
            tries++;
        }
        if (exists) return res.status(500).json({ error: 'ID collision' });

        // store mapping + metadata
        await redis.set(`u:${id}`, url);
        await redis.hset(`m:${id}`, { createdAt: Date.now().toString(), hits: '0' });

        const base = (process.env.BASE_URL || `http://${req.headers.host}`).replace(/\/$/, '');
        const shortUrl = `${base}/${id}`;

        return res.status(201).json({ id, shortUrl, url });
    } catch (err: any) {
        console.error('shorten error', err);
        // Always return JSON — don't leak HTML
        return res.status(500).json({ error: 'Server error', detail: err?.message ?? null });
    }
}
