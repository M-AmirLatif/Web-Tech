var pdf = require('pdf-creator-node')
var fs = require('fs')

// load HTML template
var html = fs.readFileSync('template.html', 'utf8')

var options = {
  format: 'A3',
  orientation: 'portrait',
  border: '10mm',
}

var users = [
  { name: 'Shyam', age: 26 },
  { name: 'Navjot', age: 26 },
  { name: 'Vitthal', age: 26 },
]

var document = {
  html: html,
  data: { users: users },
  path: './output.pdf',
}

pdf
  .create(document, options)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
