// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Components
import Link from 'next/link'

const BookCard = ({ book, style }) => {
  console.log(book)

  return (
    <>
      <Grid item xs={6} md={3}>
        <Link href={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
          <Card className='book-card' style={style}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <img src={book?.coverImageURL} alt={'img'} style={{ margin: 'auto' }} height={200} width={200} />
              <Box sx={{ alignItems: 'stretch' }}>
                <Typography variant='h6' sx={{ mb: 1 }}>
                  {book?.title}
                </Typography>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  {book?.author}
                </Typography>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  {book?.averageRating} / 10
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </>
  )
}

export default BookCard
