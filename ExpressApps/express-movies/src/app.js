const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// In-memory storage
let movies = []
let movieId = 1

// ------------------------------------
// POST /movies
// Create a movie
// ------------------------------------
app.post('/movies', (req, res) => {
  const { title, genre, rating, year } = req.body

  // Validation
  if (
    typeof title !== 'string' ||
    typeof genre !== 'string' ||
    typeof rating !== 'number' ||
    rating < 0 ||
    rating > 10 ||
    typeof year !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid movie data' })
  }

  const newMovie = {
    id: movieId++,
    title,
    genre,
    rating,
    year,
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// ------------------------------------
// GET /movies
// Filtering & Pagination
// ------------------------------------
app.get('/movies', (req, res) => {
  let result = [...movies]

  const { genre, minRating, page = 1, limit = 5 } = req.query

  // Filter by genre
  if (genre) {
    result = result.filter((m) => m.genre === genre)
  }

  // Filter by minimum rating
  if (minRating) {
    result = result.filter((m) => m.rating >= Number(minRating))
  }

  // Pagination
  const pageNumber = Number(page)
  const limitNumber = Number(limit)
  const start = (pageNumber - 1) * limitNumber
  const end = start + limitNumber

  const paginatedMovies = result.slice(start, end)

  res.json({
    total: result.length,
    page: pageNumber,
    limit: limitNumber,
    data: paginatedMovies,
  })
})

// ------------------------------------
// GET /movies/:id
// Get movie by ID
// ------------------------------------
app.get('/movies/:id', (req, res) => {
  const id = Number(req.params.id)

  const movie = movies.find((m) => m.id === id)

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  res.json(movie)
})

// ------------------------------------
// PATCH /movies/:id/rating
// Update rating only
// ------------------------------------
app.patch('/movies/:id/rating', (req, res) => {
  const id = Number(req.params.id)
  const { rating } = req.body

  const movie = movies.find((m) => m.id === id)

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  if (typeof rating !== 'number' || rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'Rating must be between 0 and 10' })
  }

  movie.rating = rating

  res.json(movie)
})

module.exports = app
