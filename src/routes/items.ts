import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const itemsRoutes = new Hono()

// In-memory store (replace with your DB later)
type Item = { id: number; name: string; createdAt: string }
let items: Item[] = [
    { id: 1, name: 'Sample Item 1', createdAt: new Date().toISOString() },
    { id: 2, name: 'Sample Item 2', createdAt: new Date().toISOString() },
]
let nextId = 3

// GET /api/items
itemsRoutes.get('/', (c) => {
    return c.json({ data: items, total: items.length })
})

// GET /api/items/:id
itemsRoutes.get('/:id', (c) => {
    const id = Number(c.req.param('id'))
    const item = items.find((i) => i.id === id)
    if (!item) {
        return c.json({ error: 'Item not found' }, 404)
    }
    return c.json({ data: item })
})

// POST /api/items
const createItemSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
})

itemsRoutes.post(
    '/',
    zValidator('json', createItemSchema),
    (c) => {
        const { name } = c.req.valid('json')
        const newItem: Item = { id: nextId++, name, createdAt: new Date().toISOString() }
        items.push(newItem)
        return c.json({ data: newItem }, 201)
    }
)
