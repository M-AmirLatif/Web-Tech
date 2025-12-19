const express = require('express')
const session = require('express-session')
const path = require('path')

const pagesRouter = require('./routes/pages')
const adminRouter = require('./routes/admin')
const checkoutRoutes = require('./routes/checkout')
const orderRoutes = require('./routes/order')

const app = express()

// View engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ✅ SESSION MUST COME BEFORE ROUTES
app.use(
  session({
    secret: 'cart_secret_key',
    resave: false,
    saveUninitialized: true,
  })
)

app.use((req, res, next) => {
  req.session.email = 'admin@shop.com'
  next()
})

// ✅ Initialize cart safely
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = []
  }
  next()
})

// Routes
app.use('/', pagesRouter)
app.use('/admin', adminRouter)
app.use(checkoutRoutes)
app.use(orderRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page Not Found',
  })
})

module.exports = app
