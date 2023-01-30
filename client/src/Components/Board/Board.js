import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import Cell from '../Cell/Cell'
import './Board.css'

const Board = ({ socket, roomCode }) => {
  const [board, setBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [isWaiting, setIsWaiting] = useState(true)
  const [opponent, setOpponent] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isWinner, setIsWinner] = useState(false)
  const [amIWinner, setAmIWinner] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [amIfirst, setAmIFirst] = useState(false)
  const mySymbol = amIfirst ? 'X' : 'O'
  const [canPlay, setCanPlay] = useState(mySymbol === 'X' ? true : false)

  useEffect(() => {
    socket.on('updateGame', ({ id, name }) => {
      setBoard((data) => ({ ...data, [id]: mySymbol === 'X' ? 'O' : 'X' }))
      setOpponent(name)
      setCanPlay(true)
    })

    socket.on('Who_is_first', () => {
      setAmIFirst(true)
      setCanPlay(true)
    })

    socket.on('joined_user', (name) => {
      setOpponent(name)
      setIsWaiting(false)
    })

    return () => socket.off('updateGame')
  })

  useEffect(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    const boardValues = Object.values(board)

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      const threeSameSymbols =
        board[a] && board[a] === board[b] && board[a] === board[c]

      if (!boardValues.includes(null)) {
        setIsWaiting(false)
        setIsWinner(true)
        setCanPlay(false)
        setIsStarted(false)
        setIsDraw(true)
      }

      if (threeSameSymbols) {
        setIsWinner(true)
        setCanPlay(false)
        setIsStarted(false)

        if (board[a] === mySymbol) {
          setAmIWinner(true)
        }
      }
    }
    console.log(isDraw)
  }, [board])

  const startTheGame = () => {
    socket.emit('play', {
      name: localStorage.getItem('name'),
      roomCode: roomCode,
      isReady: true,
    })
    setIsStarted(true)
    mySymbol === 'X' ? setCanPlay(true) : setCanPlay(false)
    socket.on('updateGame', ({ isReady }) => {
      setIsWaiting(!isReady)
    })
  }

  const handleCellClick = (e) => {
    const id = +e.currentTarget.id
    if (canPlay && board[id] === null) {
      setBoard((data) => ({ ...data, [id]: mySymbol }))
      socket.emit('play', {
        id,
        roomCode,
        name: localStorage.getItem('name'),
      })
      setCanPlay(false)
    }

    if (
      (board[0] === 'X' && board[1] === 'X' && board[2] === 'X') ||
      (board[0] === 'O' && board[1] === 'O' && board[2] === 'O')
    ) {
      setBoard([null, null, null, null, null, null, null, null, null])
    }
  }

  return (
    <>
      {!isStarted ? (
        <div>
          {isWaiting ? (
            <div className='align-center'>
              <h1 style={{ textAlign: 'center' }}>
                Waiting for your opponent....
              </h1>
            </div>
          ) : (
            <>
              {isWinner ? (
                <div className='align-center'>
                  {isDraw ? (
                    <h1>Draw</h1>
                  ) : (
                    <h1>{amIWinner ? 'You won' : 'You lost'}</h1>
                  )}
                </div>
              ) : (
                <div className='align-center'>
                  <Button variant='contained' onClick={startTheGame}>
                    Start the game with {opponent}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: 'center' }}>
            You are playing with {opponent}
          </h1>

          {canPlay ? (
            <h2 style={{ textAlign: 'center', marginTop: 15 }}>Your turn</h2>
          ) : (
            <h2 style={{ textAlign: 'center', marginTop: 15 }}>
              Your opponent's turn
            </h2>
          )}

          <main>
            <section className='main-section'>
              <Cell
                handleCellClick={handleCellClick}
                id={'0'}
                text={board[0]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'1'}
                text={board[1]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'2'}
                text={board[2]}
              />

              <Cell
                handleCellClick={handleCellClick}
                id={'3'}
                text={board[3]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'4'}
                text={board[4]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'5'}
                text={board[5]}
              />

              <Cell
                handleCellClick={handleCellClick}
                id={'6'}
                text={board[6]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'7'}
                text={board[7]}
              />
              <Cell
                handleCellClick={handleCellClick}
                id={'8'}
                text={board[8]}
              />
            </section>
          </main>
        </>
      )}
    </>
  )
}

export default Board
