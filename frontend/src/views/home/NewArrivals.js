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
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'

const data = [{}, {}]

const Slides = () => {
  return (
    <>
      {data.map((slide, index) => {
        return (
          <Grid key={index} container spacing={1} className='keen-slider__slide'>
            <Grid item xs={6} md={2}>
              <Typography variant='h4' className='tranform-rotate-90'>
                New Arrivals
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Card className='ecommerce-card'>
                <img
                  src='https://i.pinimg.com/564x/68/57/09/685709a8b2632bef579219d54469f358.jpg'
                  alt={slide.title}
                  height={200}
                  width={200}
                />
              </Card>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant='h5' sx={{ mb: 2, ml: 4, color: 'common.white' }}>
                Book Title
              </Typography>
              <Typography variant='subtitle1' sx={{ mb: 2, ml: 6, color: 'common.white' }}>
                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </Typography>
              <Typography variant='h6' sx={{ mb: 2, ml: 4, color: 'common.white' }}>
                Book Author
              </Typography>
            </Grid>
          </Grid>
        )
      })}
    </>
  )
}

const NewArrivals = () => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ** Hook
  const theme = useTheme()

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'warning.main' }}>
      <CardContent>
        {loaded && instanceRef.current && (
          <Box className='swiper-dots' sx={{ top: 7, right: 13, position: 'absolute' }}>
            {[...Array(instanceRef.current.track.details?.slides.length).keys()].map(idx => {
              return (
                <Badge
                  key={idx}
                  variant='dot'
                  component='div'
                  className={clsx({
                    active: currentSlide === idx
                  })}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  sx={{
                    mr: theme => `${theme.spacing(2.5)} !important`,
                    '&.active': {
                      '& .MuiBadge-dot': {
                        backgroundColor: theme => `${theme.palette.common.white} !important`
                      }
                    },
                    '& .MuiBadge-dot': {
                      height: '6px !important',
                      width: '6px !important',
                      minWidth: '6px !important'
                    }
                  }}
                ></Badge>
              )
            })}
          </Box>
        )}
        <Box ref={sliderRef} className='keen-slider'>
          <Slides />
        </Box>
      </CardContent>
    </Card>
  )
}

export default NewArrivals
