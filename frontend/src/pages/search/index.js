// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { TextField } from '@mui/material'

// ** Vars
const bookAvailabilityObj = {
  hardCopy: { icon: 'mdi:laptop', color: 'error.main' },
  ebook: { icon: 'mdi:cog-outline', color: 'warning.main' },
  audioBook: { icon: 'mdi:pencil-outline', color: 'info.main' }
}

const bookStatusObj = {
  inshelf: 'success',
  borrowing: 'warning',
  return: 'secondary'
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {
  if (row.coverImageURL) {
    return <CustomAvatar src={row.coverImageURL} sx={{ mr: 3, width: 90, height: 100, borderRadius: '12px' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 90, height: 100, fontSize: '1rem', borderRadius: '12px' }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }) => {
  return (
    <>
      <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href={`/books/${id}`}>
        <Icon icon='mdi:eye-outline' fontSize={20} />
        View
      </MenuItem>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 450,
    field: 'title',
    headerName: 'Book Title',
    renderCell: ({ row }) => {
      const { title, author, id } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink sx={{ fontSize: '18px', display: 'block', marginBottom: '5px' }} href={`/books/${id}`}>
              {title}
            </StyledLink>
            <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
              {`@${author.split("'").join('').split('[').join('').split(']').join('')}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'genres',
    minWidth: 150,
    headerName: 'Genres',
    renderCell: ({ row }) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 3, color: bookAvailabilityObj[row.role]?.color }
          }}
        >
          <Icon icon={bookAvailabilityObj[row.role]?.icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.tags?.split("'").join('').split('[').join('').split(']').join('')}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'average Rating',
    field: 'averageRating',
    renderCell: ({ row }) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.averageRating} / 10
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Publisher',
    field: 'publisher',
    renderCell: ({ row }) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row?.publisher || 'N/A'}
        </Typography>
      )
    }
  },

  // {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'publisher',
  //   headerName: 'Publisher',
  //   renderCell: ({ row }) => {
  //     return (
  //       <CustomChip
  //         skin='light'
  //         size='small'
  //         label={row.status}
  //         color={bookStatusObj[row.publisher]}
  //         sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
  //       />
  //     )
  //   }
  // },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const BookList = ({ apiData }) => {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('')

  useEffect(() => {
    fetch(`http://localhost:8000/books-search?search=${search}`, {})
      .then(response => response.json())
      .then(data => {
        setBooks(data)
      })

    fetch(`http://localhost:8000/genres`, {})
      .then(response => response.json())
      .then(data => {
        setGenres(data)
      })
  }, [search])

  useEffect(() => {
    fetch(`http://localhost:8000/books-genre?genre=${genre}`, {})
      .then(response => response.json())
      .then(data => {
        setBooks(data)
      })
  }, [genre])

  const [pageSize, setPageSize] = useState(10)

  // ** Function to handle Pagination

  const handleFilter = value => {
    setSearch(value)
  }

  const handleGenreChange = value => {
    setGenre(value)
  }

  const getGenresValue = url => {
    const value = url.split('#')[1]

    return value
  }

  const showBeatifulGenreName = genre => {
    let value = ''

    for (let i = 1; i < genre.split('_').length; i++) {
      value += genre.split('_')[i] + ' '
    }

    return value ? value : genre
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth>
                  {/* <InputLabel id='Search'>Search book</InputLabel> */}
                  <TextField
                    fullWidth
                    id='search'
                    label='Search'
                    placeholder='Search book'
                    value={search}
                    onChange={e => handleFilter(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='ganre-select'>Select Genre</InputLabel>
                  <Select
                    fullWidth
                    value={genres[0]?.genre}
                    id='select-ganre'
                    label='Select ganre'
                    labelId='ganre-select'
                    onChange={e => handleGenreChange(e.target.value)}
                    inputProps={{ placeholder: 'Select Genre' }}
                  >
                    <MenuItem value=''>Select Genre</MenuItem>
                    {genres.map((genre, index) => {
                      return (
                        <MenuItem key={index} value={getGenresValue(genre?.genre)}>
                          {showBeatifulGenreName(getGenresValue(genre?.genre))}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item sm={3} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='genre-select'>Select genre</InputLabel>
                  <Select
                    fullWidth
                    value={genre}
                    id='select-genre'
                    label='Select genre'
                    labelId='genre-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select genre' }}
                  >
                    <MenuItem value=''>Select genre</MenuItem>
                    <MenuItem value='hardCopy'>Hard Copy</MenuItem>
                    <MenuItem value='ebook'>E Book</MenuItem>
                    <MenuItem value='audioBook'>Audio book</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Status' }}
                  >
                    <MenuItem value=''>Select Status</MenuItem>
                    <MenuItem value='ebook'>inshelf</MenuItem>
                    <MenuItem value='audioBook'>borrowing</MenuItem>
                    <MenuItem value='hardCopy'>return</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
            </Grid>
          </CardContent>
          <Divider />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <DataGrid
            autoHeight
            rowHeight={120}
            rows={books ? books : [{ title: 'loading' }]}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default BookList
