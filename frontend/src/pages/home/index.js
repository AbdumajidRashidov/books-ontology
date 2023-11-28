// ** MUI Imports
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import BookCard from 'src/views/home/BookCard'

// ** Demo Components Imports
import DailyQuotes from 'src/views/home/DailyQuotes'
import NewArrivals from 'src/views/home/NewArrivals'

const Home = () => {
  const [books, setBooks] = useState([])
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/books')
      .then(response => response.json())
      .then(data => {
        setBooks(data)
      })
  }, [])

  console.log(quotes)

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={6}>
            <DailyQuotes />
          </Grid>
          <Grid item xs={12} md={6}>
            <NewArrivals />
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Hello John!
            </Typography>
            <Typography variant='h4' sx={{ mb: 5 }}>
              Recommended for You
            </Typography>
            <Grid container spacing={4} sx={{ mb: 4, display: 'flex', flexWrap: 'wrap' }}>
              {books.map((item, index) => {
                return <BookCard key={index} book={item} />
              })}
            </Grid>
            <Typography variant='h4' sx={{ mb: 5 }}>
              Recent Reads
            </Typography>
            <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {books.map((item, index) => {
                return <BookCard key={index} book={item} />
              })}
            </Grid>
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default Home
