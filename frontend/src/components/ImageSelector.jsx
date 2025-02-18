import { useState, useEffect } from 'react'
import '../App.css'

const Game = () => {
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [remainingCharacters, setRemainingCharacters] = useState([
    'guy',
    'cuervo',
    'dog',
  ])
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [lastClick, setLastClick] = useState({ x: 0, y: 0 })

  // Timer
  useEffect(() => {
    let interval
    if (!gameOver) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameOver])

  // Handle image click
  const handleClick = (e) => {
    if (gameOver) return

    const rect = e.target.getBoundingClientRect()
    const image = e.target
    const pageX = e.pageX
    const pageY = e.pageY

    // Normalize coordinates
    const imageX = pageX - rect.left
    const imageY = pageY - rect.top
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const normalizedX = imageX * scaleX
    const normalizedY = imageY * scaleY

    setLastClick({ x: normalizedX, y: normalizedY })

    // Show selector
    const selector = document.querySelector('.selector')
    selector.style.display = 'flex'
    selector.style.top = `${pageY + 15}px`
    selector.style.left = `${pageX + 15}px`
  }

  // Handle character selection
  const handleCharacterSelect = async (character) => {
    const { x, y } = lastClick

    try {
      const response = await fetch('http://localhost:5000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, character }),
      })

      const data = await response.json()

      if (data.success) {
        setRemainingCharacters((prev) => prev.filter((c) => c !== character))
        setMessage('Correct!')

        if (remainingCharacters.length - 1 === 0) {
          setGameOver(true)
          setShowForm(true)
        }
      } else {
        setMessage(data.message || 'Wrong, try again!')
      }
    } catch (error) {
      console.error('Error validating character:', error)
    }

    // Hide selector
    document.querySelector('.selector').style.display = 'none'
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('http://localhost:5000/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, time }),
      })
      alert('Score submitted!')
      window.location.reload()
    } catch (error) {
      console.error('Error submitting score:', error)
    }
  }

  return (
    <div>
      <div className='header'>
        <div className='clock'>{time} s</div>
        <div className='images'>
          {remainingCharacters.includes('guy') && (
            <img src='guy.png' alt='Guy' />
          )}
          {remainingCharacters.includes('cuervo') && (
            <img src='cuervo.png' alt='Cuervo' />
          )}
          {remainingCharacters.includes('dog') && (
            <img src='dog.png' alt='Dog' />
          )}
        </div>
      </div>

      <img src='wall.jpg' alt='Game Image' onClick={handleClick} />

      <div className='selector'>
        {remainingCharacters.includes('guy') && (
          <div
            className='select-guy'
            onClick={() => handleCharacterSelect('guy')}
          >
            <img src='guy.png' alt='Guy' />
          </div>
        )}
        {remainingCharacters.includes('cuervo') && (
          <div
            className='select-cuervo'
            onClick={() => handleCharacterSelect('cuervo')}
          >
            <img src='cuervo.png' alt='Cuervo' />
          </div>
        )}
        {remainingCharacters.includes('dog') && (
          <div
            className='select-dog'
            onClick={() => handleCharacterSelect('dog')}
          >
            <img src='dog.png' alt='Dog' />
          </div>
        )}
      </div>

      {message && <p>{message}</p>}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder='Enter your name'
            required
          />
          <button type='submit'>Submit Score</button>
        </form>
      )}
    </div>
  )
}

export default Game
