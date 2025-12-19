// Import your calculator module
const { sum, sub } = require('amir-cal')

// Import underscore
const _ = require('underscore')

// Import built–in modules
const fs = require('fs')
const os = require('os')

// OS example
console.log('Free Memory:', os.freemem())

// Using your sum & sub functions
console.log('Sum:', sum(10, 5))
console.log('Sub:', sub(10, 5))

// Using underscore .contains
const res = _.contains([1, 5, 7, 9], 9)
console.log('Contains 9:', res)
