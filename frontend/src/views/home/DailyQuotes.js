import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

const DailyQuotes = () => {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/quotes')
      .then(response => response.json())
      .then(data => {
        setQuotes(data)
      })
  }, [])

  return (
    <Card sx={{ height: '100%', backgroundColor: 'primary.main', color: 'common.white', padding: '15px' }}>
      <Swiper
        style={{
          '--swiper-pagination-color': '#FFffff',
          '--swiper-pagination-bullet-horizontal-gap': '6px',
          '--swiper-pagination-bullet-top': '0px',
          '--swiper-pagination-bullet-position': 'absolute'
        }}
        modules={[Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {quotes.map((quote, index) => {
          return (
            <SwiperSlide key={index}>
              <Typography variant='h4' sx={{ mb: 2, color: 'common.white' }}>
                Today’s Quote
              </Typography>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
                <Typography variant='h6' sx={{ mr: 1.5, ml: 1, color: 'common.white' }}>
                  {quote.description}
                </Typography>
              </Box>
              <Typography variant='subtitle1' sx={{ ml: 'auto', color: 'common.white' }}>
                {quote.author}
              </Typography>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Card>
  )
}

export default DailyQuotes
