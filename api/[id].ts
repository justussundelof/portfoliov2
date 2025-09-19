import { VercelRequest, VercelResponse } from '@vercel/node';

interface UrlMap { [id: string]: string; }
const urls: UrlMap = {}; // same in-memory store

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).send('Invalid ID');

    const target = urls[id];
    if (!target) return res.status(404).send('URL not found');

    res.redirect(target);
}
