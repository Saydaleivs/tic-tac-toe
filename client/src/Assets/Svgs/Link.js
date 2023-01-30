import { motion, useAnimation } from 'framer-motion'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const LinkSvg = ({ setShowModal }) => {
  const navigate = useNavigate()
  const [name, setName] = useState()

  const showModal = () => {
    if (name) {
      setShowModal(true)
      // navigate('/joinRoom')
      localStorage.setItem('name', name)
    } else {
      alert('Enter your name')
    }
  }

  return (
    <>
      <input
        className='joinRoomModal-card-input'
        type='text'
        placeholder='Your name'
        onChange={(e) => setName(e.target.value)}
      />

      <Button className='login-btn' variant='contained' onClick={showModal}>
        Start the Game
      </Button>
    </>
  )
}

export default LinkSvg
