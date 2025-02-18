import express from 'express'
import cors from 'cors'
import { pool } from './db.js' // PostgreSQL connection

const app = express()
app.use(cors())
app.use(express.json())

// Character positions (these should match what you use in frontend)
const characters = {
  guy: { x: 267, y: 1534 },
  cuervo: { x: 816, y: 741 },
  dog: { x: 1985, y: 1280 },
}

// Tolerance for valid clicks
const TOLERANCE = 20

// Validate character selection
app.post('/api/validate', (req, res) => {
  const { x, y, character } = req.body

  if (!characters[character])
    return res.status(400).json({ error: 'Invalid character' })

  const { x: charX, y: charY } = characters[character]
  const isValid =
    Math.abs(x - charX) <= TOLERANCE && Math.abs(y - charY) <= TOLERANCE

  if (isValid) {
    return res.json({ success: true })
  } else {
    return res.json({ success: false, message: 'Try again!' })
  }
})

// Store high score
app.post('/api/submit-score', async (req, res) => {
  const { name, time } = req.body

  try {
    await pool.query('INSERT INTO scores (name, time) VALUES ($1, $2)', [
      name,
      time,
    ])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Database error' })
  }
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
