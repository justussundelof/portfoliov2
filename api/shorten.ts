// api/shorten.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { customAlphabet } from 'nanoid'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// generate 6-char friendly id
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

    try {
        const { url } = req.body as { url?: string }
        if (!url) return res.status(400).json({ error: 'Missing url' })

        // Basic validation
        try {
            new URL(url)
        } catch {
            return res.status(400).json({ error: 'Invalid URL' })
        }

        // Generate id and ensure no collision (few attempts)
        let id = nanoid()
        let exists = await redis.get(`u:${id}`)
        let tries = 0
        while (exists && tries < 5) {
            id = nanoid()
            exists = await redis.get(`u:${id}`)
            tries++
        }
        if (exists) return res.status(500).json({ error: 'ID collision, try again' })

        // store mapping and metadata
        await redis.set(`u:${id}`, url)
        await redis.hset(`m:${id}`, { createdAt: Date.now().toString(), hits: '0' })

        const shortUrl = `${process.env.BASE_URL?.replace(/\\/$ /, '')}/${id}`

        return res.status(201).json({ id, shortUrl, url })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error' })
    }
}
