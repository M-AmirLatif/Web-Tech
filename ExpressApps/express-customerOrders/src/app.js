const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// In-memory storage
let orders = []
let orderId = 1

// Allowed order statuses
const allowedStatuses = ['pending', 'paid', 'shipped', 'cancelled']

// ------------------------------------
// POST /orders
// Create a new order
// ------------------------------------
app.post('/orders', (req, res) => {
  const { customer, items } = req.body

  // Validation
  if (
    typeof customer !== 'string' ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ error: 'Invalid order data' })
  }

  let total = 0

  for (const item of items) {
    if (
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      typeof item.qty !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid item data' })
    }

    total += item.price * item.qty
  }

  const newOrder = {
    id: orderId++,
    customer,
    items,
    status: 'pending',
    total,
  }

  orders.push(newOrder)

  res.status(201).json(newOrder)
})

// ------------------------------------
// GET /orders
// Get all orders
// ------------------------------------
app.get('/orders', (req, res) => {
  res.json(orders)
})

// ------------------------------------
// GET /orders/:id
// Get order by ID
// ------------------------------------
app.get('/orders/:id', (req, res) => {
  const id = Number(req.params.id)

  const order = orders.find((o) => o.id === id)

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  res.json(order)
})

// ------------------------------------
// PATCH /orders/:id/status
// Update order status
// ------------------------------------
app.patch('/orders/:id/status', (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body

  const order = orders.find((o) => o.id === id)

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ error: 'Cancelled order cannot be updated' })
  }

  if (order.status === 'shipped' && status !== 'shipped') {
    return res.status(400).json({ error: 'Shipped order cannot be reverted' })
  }

  order.status = status

  res.json(order)
})

// ------------------------------------
// DELETE /orders/:id
// Delete order (only pending)
// ------------------------------------
app.delete('/orders/:id', (req, res) => {
  const id = Number(req.params.id)

  const index = orders.findIndex((o) => o.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' })
  }

  if (orders[index].status !== 'pending') {
    return res.status(400).json({ error: 'Only pending orders can be deleted' })
  }

  orders.splice(index, 1)

  res.json({ message: 'Order deleted successfully' })
})
module.exports = app
