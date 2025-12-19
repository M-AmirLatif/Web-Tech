const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Calculator route
app.post('/calculate/:operation', (req, res) => {
  const { operation } = req.params
  const { a, b } = req.body

  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' })
  }

  let result

  if (operation === 'add') {
    result = a + b
  } else if (operation === 'subtract') {
    result = a - b
  } else if (operation === 'multiply') {
    result = a * b
  } else if (operation === 'divide') {
    if (b === 0) {
      return res.status(400).json({ error: 'Cannot divide by zero' })
    }
    result = a / b
  } else {
    return res.status(400).json({ error: 'Invalid operation' })
  }

  res.json({ result })
})

module.exports = app
