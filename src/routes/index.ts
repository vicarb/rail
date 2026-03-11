import { Hono } from 'hono'
import { itemsRoutes } from './items'

export const apiRoutes = new Hono()

// Mount sub-routers
apiRoutes.route('/items', itemsRoutes)

// API root
apiRoutes.get('/', (c) => {
    return c.json({
        message: 'API is running',
        version: '1.0.0',
        endpoints: [
            'GET  /health',
            'GET  /api',
            'GET  /api/items',
            'GET  /api/items/:id',
            'POST /api/items',
        ],
    })
})
