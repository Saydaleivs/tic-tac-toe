import Board from './Components/Board/Board'
import Footer from './Components/Footer/Footer'
import JoinRoomModal from './Components/JoinRoomModal/JoinRoomModal'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import video from './Assets/Svgs/IMG_3566.MP4'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const socket = io.connect('https://tic-tac-toe-server-vfh6.onrender.com')

function App() {
  const [showModal, setShowModal] = useState(false)
  const [roomCode, setRoomCode] = useState(null)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    if (roomCode) {
      socket.emit('joinRoom', roomCode)
    }
  }, [roomCode])

  return (
    <>
      {isAllowed ? (
        <BrowserRouter>
          <Routes>
            {' '}
            <Route
              path='/game'
              element={<Board socket={socket} roomCode={roomCode} />}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className='align-center'>
          <BrowserRouter>
            <video autoPlay loop muted id='background-video'>
              <source src={video} type='video/mp4' />
            </video>

            <Footer setShowModal={setShowModal} />

            <JoinRoomModal
              socket={socket}
              showModal={showModal}
              setShowModal={setShowModal}
              setRoomCode={setRoomCode}
              setIsAllowed={setIsAllowed}
            />
          </BrowserRouter>
        </div>
      )}
    </>
  )
}

export default App
