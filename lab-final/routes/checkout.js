const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const { checkCartNotEmpty } = require('../middleware/auth')

router.get('/checkout', checkCartNotEmpty, (req, res) => {
  const cart = req.session.cart || []

  let total = 0
  cart.forEach((item) => {
    total += item.price * item.quantity
  })

  res.render('pages/checkout', {
    cart,
    total,
  })
})

router.post('/checkout', checkCartNotEmpty, async (req, res) => {
  const { customerName, email } = req.body

  // ✅ Server-side validation
  if (!customerName || !email) {
    return res.status(400).send('Name and Email are required')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format')
  }

  const cart = req.session.cart
  let total = 0

  cart.forEach((item) => {
    total += item.price * item.quantity
  })

  const order = new Order({
    customerName,
    email,
    items: cart.map((item) => ({
      product: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: total,
  })

  const savedOrder = await order.save()

  req.session.cart = []

  res.redirect(`/order-confirmation/${savedOrder._id}`)
})


module.exports = router
