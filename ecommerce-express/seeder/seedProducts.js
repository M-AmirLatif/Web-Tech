require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('../models/Product')

const products = [
  {
    name: 'Laptop',
    price: 800,
    category: 'electronics',
    image: '/images/laptop.jpg',
    description: 'High performance laptop',
  },
  {
    name: 'Headphones',
    price: 120,
    category: 'electronics',
    image: '/images/headphones.jpg',
    description: 'Noise cancelling headphones',
  },
  {
    name: 'Shoes',
    price: 90,
    category: 'fashion',
    image: '/images/shoes.jpg',
    description: 'Comfortable running shoes',
  },
  {
    name: 'T-Shirt',
    price: 25,
    category: 'fashion',
    image: '/images/tshirt.jpg',
    description: 'Cotton t-shirt',
  },
]

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    await Product.deleteMany()
    await Product.insertMany(products)

    console.log('Sample products inserted')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

seedData()
