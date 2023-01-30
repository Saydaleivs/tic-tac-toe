import './JoinRoomModal.css'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const backgrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const modal = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },

  visible: {
    y: '00px',
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
}

const JoinRoomModal = ({
  showModal,
  setShowModal,
  setRoomCode,
  setIsAllowed,
  socket,
}) => {
  const navigate = useNavigate()
  const [roomCodeInput, setRoomCodeInput] = useState(null)
  const handleSave = () => {
    setShowModal(false)
    setIsAllowed(true)
    setRoomCode(roomCodeInput)
    socket.emit('play', {
      name: localStorage.getItem('name'),
      roomCode: roomCodeInput,
    })

    navigate('/game')
  }

  return (
    <>
      {showModal && (
        <motion.div
          className='joinRoomModal-container'
          variants={backgrop}
          initial='hidden'
          animate='visible'
          exit='exit'
        >
          <motion.div className='joinRoomModal-card' variants={modal}>
            <h1 className='joinRoomModal-card-title'>Enter a room number</h1>
            <input
              className='joinRoomModal-card-input'
              type='number'
              placeholder='Room ID'
              onChange={(e) => setRoomCodeInput(e.target.value)}
            />
            <Button
              variant='contained'
              style={{ padding: 10, fontSize: 20 }}
              onClick={handleSave}
            >
              Join room
            </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default JoinRoomModal
