// /api/[id].ts
let urls: Record<string, string> = {}; // in-memory store for demo

export default function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        const original = urls[id];
        if (original) return res.redirect(302, original);
        return res.status(404).send('Not found');
    }

    if (req.method === 'POST') {
        const { originalUrl } = req.body;
        const newId = Math.random().toString(36).substring(2, 8);
        urls[newId] = originalUrl;
        return res.status(200).json({ id: newId, shortUrl: `${req.headers.origin}/${newId}`, original: originalUrl });
    }

    res.status(405).send('Method not allowed');
}
