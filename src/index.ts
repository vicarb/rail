import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import "dotenv/config"
import { apiRoutes } from './routes'

const app = new Hono()

// --- Global Middleware ---
app.use('*', logger())
app.use('*', cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', prettyJSON())

// --- Health Check ---
app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? 'development',
    })
})

// --- API Routes ---
app.route('/api', apiRoutes)

// --- 404 Handler ---
app.notFound((c) => {
    return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

// --- Error Handler ---
app.onError((err, c) => {
    console.error(`[Error] ${err.message}`, err.stack)
    return c.json(
        { error: 'Internal Server Error', message: err.message },
        500
    )
})

// --- Start Server ---
const PORT = Number(process.env.PORT) || 3001

serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`🚀 Server running on http://localhost:${info.port}`)
    console.log(`📡 Environment: ${process.env.NODE_ENV ?? 'development'}`)
})
