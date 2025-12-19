const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// In-memory users array
let users = []
let idCounter = 1

// --------------------
// POST /users
// Create a new user
// --------------------
app.post('/users', (req, res) => {
  const { name, email, age, active } = req.body

  // Validation
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof age !== 'number' ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  const newUser = {
    id: idCounter++,
    name,
    email,
    age,
    active,
  }

  users.push(newUser)

  res.status(201).json(newUser)
})

// --------------------
// GET /users
// Get all users
// --------------------
app.get('/users', (req, res) => {
  res.json(users)
})

// --------------------
// GET /users/:id
// Get one user
// --------------------
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id)

  const user = users.find((u) => u.id === id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

// --------------------
// PUT /users/:id/status
// Update user active status
// --------------------
app.put('/users/:id/status', (req, res) => {
  const id = Number(req.params.id)
  const { active } = req.body

  const user = users.find((u) => u.id === id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: 'Active must be boolean' })
  }

  user.active = active

  res.json(user)
})

module.exports = app
