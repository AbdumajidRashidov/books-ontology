// ** React Imports
import { useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { TypeAnimation } from 'react-type-animation'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import BookCard from 'src/views/home/BookCard'

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  padding: theme.spacing(5)
}))

const ChatLog = props => {
  // ** Props
  const { hidden, questions } = props

  // ** Ref
  const chatArea = useRef(null)

  // ** Renders user chat
  const renderChats = () => {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'end',
          height: 'inherit',
          flexDirection: 'column',
          justifyContent: 'end'
        }}
      >
        {questions.books?.length == 0 ? (
          <Box>
            <p
              className='question'
              style={{
                backgroundColor: '#666CFF',
                color: 'white',
                padding: '10px',
                borderRadius: '10px 0px 10px 10px',
                marginLeft: '100px'
              }}
            >
              {questions.question}
            </p>
            <p
              className='answer'
              style={{
                marginRight: '100px',
                backgroundColor: '#72e128',
                color: 'white',
                padding: '10px',
                width: '80%',
                borderRadius: '0px 10px 10px 10px'
              }}
            >
              {questions.message}
            </p>
          </Box>
        ) : (
          questions.books?.length > 0 && (
            <>
              <p
                className='question'
                style={{
                  backgroundColor: '#666CFF',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px 0px 10px 10px',
                  marginLeft: '100px'
                }}
              >
                {questions.question}
              </p>
              <p
                className='answer'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',

                  // height: '100%',
                  marginRight: '100px',
                  backgroundColor: '#72e128',
                  color: 'white',
                  padding: '10px',
                  width: '80%',
                  borderRadius: '0px 10px 10px 10px'
                }}
              >
                {questions.author && <h2>I can recommend these books by this author</h2>}
                {questions.title && <h2>I can recommend these books by this name</h2>}
                {questions.genre && <h2>I can recommend these books by this genre</h2>}
                {questions.publicationDate && <h2>I can recommend these books by this date</h2>}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {questions.books?.map((book, index) => {
                    return <BookCard style={{ width: '250px', height: '350px' }} key={index} book={book} />
                  })}
                </div>
              </p>
            </>
          )
        )}
      </Box>
    )
  }

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  return (
    <Box sx={{ height: 'calc(100% - 8.4375rem)' }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  )
}

export default ChatLog
