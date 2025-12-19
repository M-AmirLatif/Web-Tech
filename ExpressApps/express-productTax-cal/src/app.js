const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// POST route for product calculations
app.post('/product/calculate/:method', (req, res) => {
  const { method } = req.params

  const { price, discount, tax, tags, findTag } = req.body

  // Basic validations
  if (typeof price !== 'number') {
    return res.status(400).json({ error: 'Price must be a number' })
  }

  if (typeof discount !== 'number') {
    return res.status(400).json({ error: 'Discount must be a number' })
  }

  if (typeof tax !== 'number') {
    return res.status(400).json({ error: 'Tax must be a number' })
  }

  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags must be an array' })
  }

  let result

  switch (method) {
    case 'finalPrice': {
      // Step 1: apply discount
      const afterDiscount = price - (price * discount) / 100

      // Step 2: apply tax on discounted price
      result = afterDiscount + (afterDiscount * tax) / 100
      break
    }

    case 'onlyDiscount': {
      result = price - (price * discount) / 100
      break
    }

    case 'onlyTax': {
      result = price + (price * tax) / 100
      break
    }

    case 'checkTag': {
      if (typeof findTag !== 'string') {
        return res.status(400).json({ error: 'findTag must be a string' })
      }

      const exists = tags.includes(findTag)

      return res.json({ exists })
    }

    default:
      return res.status(400).json({ error: 'Invalid calculation method' })
  }

  // Return final calculated result
  res.json({ result })
})
module.exports = app
