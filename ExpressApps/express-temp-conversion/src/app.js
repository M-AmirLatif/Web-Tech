const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// POST route for temperature conversion

app.post('/convert/:scale', (req, res) => {
  const { scale } = req.params;   // route parameter
  const { value } = req.body;     // JSON body value

  // Validate input
  if (typeof value !== 'number') {
    return res.status(400).json({ error: 'Value must be a number' });
  }

  let result;

  switch (scale) {
    case 'toCelsius':
      // Fahrenheit -> Celsius
      result = (value - 32) * (5 / 9);
      break;

    case 'toFahrenheit':
      // Celsius -> Fahrenheit
      result = (value * 9 / 5) + 32;
      break;

    case 'toKelvin':
      // Celsius -> Kelvin
      result = value + 273.15;
      break;

    case 'fromKelvin':
      // Kelvin -> Celsius
      result = value - 273.15;
      break;

    default:
      return res.status(400).json({ error: 'Invalid conversion scale' });
  }

  // Send result
  res.json({ result });
});
module.exports = app
