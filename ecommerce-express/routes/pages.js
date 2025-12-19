const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

router.get('/', (req, res) => {
  res.render('pages/home')
})


router.get('/shop', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const skip = (page - 1) * limit

    const { category, minPrice, maxPrice } = req.query

    let query = {}

    if (category) {
      query.category = category
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const totalProducts = await Product.countDocuments(query)
    const products = await Product.find(query).skip(skip).limit(limit)

    const totalPages = Math.ceil(totalProducts / limit)

    res.render('pages/shop', {
      products,
      currentPage: page,
      totalPages,
      limit,
      category,
      minPrice,
      maxPrice,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed to load products')
  }
})


router.get('/product/:id', (req, res) => {
  res.render('pages/product', {
    productId: req.params.id,
  })
})


router.get('/cart', (req, res) => {
  const cart = req.session.cart || []
  res.render('pages/cart', { cart })
})

router.post('/cart/add/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!req.session.cart) {
    req.session.cart = []
  }

  req.session.cart.push({
    id: product._id,
    name: product.name,
    price: product.price,
  })

  res.redirect('/cart')
})


router.get('/checkout', (req, res) => {
  res.render('pages/checkout')
})

module.exports = router
