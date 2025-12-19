const express = require('express')
const session = require('express-session')

const path = require('path')
const pagesRouter = require('./routes/pages')
const adminRouter = require('./routes/admin')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  session({
    secret: 'cart_secret_key',
    resave: false,
    saveUninitialized: true,
  })
)

app.use('/', pagesRouter)
app.use('/admin', adminRouter)

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page Not Found',
  })
})

module.exports = app
