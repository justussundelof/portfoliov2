// api/redirect.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // we expect ?id=abcd or /api/redirect?id=abcd (vercel rewrite will supply id)
    const id = (req.query.id as string) || null
    if (!id) return res.status(400).send('Bad request')

    try {
        const url = await redis.get(`u:${id}`)
        if (!url) return res.status(404).send('Not found')

        // increment hits
        await redis.hincrby(`m:${id}`, 'hits', 1)

        // redirect
        res.writeHead(302, { Location: url })
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
}
