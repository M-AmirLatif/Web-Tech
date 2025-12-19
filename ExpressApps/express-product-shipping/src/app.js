const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/order/process/:country/:shippingMethod', (req, res) => {
  const { country, shippingMethod } = req.params
  const { items, coupon, user } = req.body

  // ---------- VALIDATION ----------
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items must be a non-empty array' })
  }

  for (const item of items) {
    if (
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      typeof item.qty !== 'number'
    ) {
      return res
        .status(400)
        .json({
          error:
            'Each item must have name (string), price (number), qty (number)',
        })
    }
  }

  if (!user || typeof user !== 'object') {
    return res.status(400).json({ error: 'User object required' })
  }

  // ---------- STEP 1: SUBTOTAL ----------
  let subtotal = 0

  for (const item of items) {
    subtotal += item.price * item.qty
  }

  // ---------- STEP 2: COUPON DISCOUNT ----------
  let discount = 0

  if (coupon === 'NEW10') {
    discount = subtotal * 0.1
  }

  if (coupon === 'ELEC5') {
    // Only electronics category gets 5% off
    const electronicsTotal = items
      .filter((i) => i.category === 'electronics')
      .reduce((sum, i) => sum + i.price * i.qty, 0)

    discount = electronicsTotal * 0.05
  }

  // FREESHIP handled later
  const freeShipping = coupon === 'FREESHIP'

  // ---------- STEP 3: SHIPPING BASED ON COUNTRY ----------
  let shippingBase = 0

  switch (country.toLowerCase()) {
    case 'usa':
      shippingBase = 20
      break
    case 'canada':
      shippingBase = 25
      break
    case 'uk':
      shippingBase = 30
      break
    default:
      shippingBase = 40
  }

  // ---------- STEP 4: SHIPPING METHOD COST ----------
  let shippingExtra = 0

  switch (shippingMethod.toLowerCase()) {
    case 'standard':
      shippingExtra = 0
      break
    case 'express':
      shippingExtra = 15
      break
    case 'overnight':
      shippingExtra = 30
      break
    default:
      return res.status(400).json({ error: 'Invalid shipping method' })
  }

  let shipping = freeShipping ? 0 : shippingBase + shippingExtra

  // ---------- STEP 5: VIP DISCOUNT ----------
  if (user.vip === true) {
    discount += subtotal * 0.05 // additional 5%
  }

  // ---------- STEP 6: HANDLING FEE IF AGE < 18 ----------
  let handlingFee = 0
  if (user.age < 18) {
    handlingFee = 5
  }

  // ---------- STEP 7: CALCULATE TOTAL ----------
  const total = subtotal - discount + shipping + handlingFee

  // ---------- RESPONSE ----------
  res.json({
    subtotal,
    discount,
    shipping,
    handlingFee,
    total,
  })
})

module.exports = app
