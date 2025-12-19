const express = require('express')
const router = express.Router()
const Order = require('../models/order')

router.get('/order-confirmation/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)

  res.render('pages/order-confirmation', {
    order,
  })
})

module.exports = router
