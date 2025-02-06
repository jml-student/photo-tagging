import { useState } from 'react'

const ImageSelector = () => {
  const [targetBox, setTargetBox] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setTargetBox({ x, y })
    setShowDropdown(true)
  }

  const handleClickOutside = () => {
    setTargetBox(null)
    setShowDropdown(false)
  }

  const handleCharacterSelect = (e) => {
    const selectedCharacter = e.target.value
    console.log('Personaje seleccionado:', selectedCharacter)
    setShowDropdown(false)
    setTargetBox(null)
  }

  return (
    <div style={{ position: 'relative' }} onClick={handleClickOutside}>
      <img
        src='../public/wall.jpg'
        alt='Find Waldo'
        onClick={(e) => {
          e.stopPropagation()
          handleImageClick(e)
        }}
        style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
      />

      {targetBox && (
        <div
          style={{
            position: 'absolute',
            left: targetBox.x - 25,
            top: targetBox.y - 25,
            width: '50px',
            height: '50px',
            border: '2px solid red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          }}
        ></div>
      )}

      {showDropdown && targetBox && (
        <div
          style={{
            position: 'absolute',
            left: targetBox.x + 20,
            top: targetBox.y + 20,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          <select
            onChange={handleCharacterSelect}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <option value='Waldo'>Waldo</option>
            <option value='Wizard'>Wizard</option>
            <option value='Wilma'>Wilma</option>
          </select>
        </div>
      )}
    </div>
  )
}

export default ImageSelector
