import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../db'
import { items } from '../db/schema'

export const itemsRoutes = new Hono()

// GET /api/items
itemsRoutes.get('/', async (c) => {
    try {
        const allItems = await db.select().from(items)
        return c.json({ data: allItems, total: allItems.length })
    } catch (error) {
        console.error('Error fetching items:', error)
        return c.json({ error: 'Failed to fetch items' }, 500)
    }
})

// POST /api/items
const createItemSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
})

itemsRoutes.post(
    '/',
    zValidator('json', createItemSchema),
    async (c) => {
        try {
            const { name } = c.req.valid('json')

            const [newItem] = await db.insert(items).values({ name }).returning()

            return c.json({ data: newItem }, 201)
        } catch (error) {
            console.error('Error creating item:', error)
            return c.json({ error: 'Failed to create item' }, 500)
        }
    }
)
