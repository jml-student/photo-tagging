import { useState, useEffect } from 'react'
import '../App.css'

const Game = () => {
  // Estado para el tiempo transcurrido
  const [time, setTime] = useState(0)
  // Estado para el mensaje de victoria
  // Estado para controlar si el juego ha terminado
  const [gameOver, setGameOver] = useState(false)

  // Coordenadas del personaje (ajusta según tu imagen)
  const characterPosition = { x: 300, y: 150 }
  // Tolerancia para el clic (en píxeles)
  const tolerance = 20

  // Efecto para el temporizador
  useEffect(() => {
    let interval
    if (!gameOver) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameOver])

  // Función para manejar el clic en la imagen
  const handleClick = (e) => {
    if (gameOver) return // Si el juego ya terminó, no hacer nada

    const rect = e.target.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Verificar si el clic está cerca del personaje
    if (
      Math.abs(clickX - characterPosition.x) < tolerance &&
      Math.abs(clickY - characterPosition.y) < tolerance
    ) {
      setGameOver(true) // Detener el juego
    }
  }

  return (
    <div>
      <div className='header'>
        <div className='clock'>{time} s</div>
        <div className='images'>
          <img src='guy.png' alt='Guy' />
          <img src='cuervo.png' alt='Crown' />
          <img src='dog.png' alt='Dog' />
        </div>
      </div>
      <div>
        <img
          src='wall.jpg' // Reemplaza con tu imagen
          alt='Imagen del juego'
          onClick={handleClick}
        />
      </div>
    </div>
  )
}

export default Game
