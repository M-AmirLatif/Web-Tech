const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// In-memory data store
let books = []
let idCounter = 1

app.post('/books', (req, res) => {
  const { title, author, price } = req.body

  // Validation
  if (
    typeof title !== 'string' ||
    typeof author !== 'string' ||
    typeof price !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid book data' })
  }

  const newBook = {
    id: idCounter++,
    title,
    author,
    price,
  }

  books.push(newBook)

  res.status(201).json(newBook)
})

app.get('/books', (req, res) => {
  res.json(books)
})
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id)

  const book = books.find((b) => b.id === id)

  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }

  res.json(book)
})
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id)
  const { title, author, price } = req.body

  const book = books.find((b) => b.id === id)

  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }

  // Validation
  if (
    typeof title !== 'string' ||
    typeof author !== 'string' ||
    typeof price !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid update data' })
  }

  book.title = title
  book.author = author
  book.price = price

  res.json(book)
})
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id)

  const index = books.findIndex((b) => b.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' })
  }

  books.splice(index, 1)

  res.json({ message: 'Book deleted successfully' })
})

module.exports = app
