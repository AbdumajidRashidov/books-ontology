// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { Checkbox, Typography } from '@mui/material'

const defaultValues = {
  bookTitle: '',
  authorName: ''
}

const Contribute = () => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = () => {
    return
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader title='Fill up Book Details' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <Controller
                      name='bookTitle'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Book title'
                          onChange={onChange}
                          placeholder='ThemeSelection'
                          error={Boolean(errors.bookTitle)}
                        />
                      )}
                    />
                    {errors.bookTitle && (
                      <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Genre</InputLabel>
                    <Select label='genre' defaultValue='drama'>
                      <MenuItem value='Comedia'>Comedia</MenuItem>
                      <MenuItem value='Drama'>Drama</MenuItem>
                      <MenuItem value='fiction'>Fiction</MenuItem>
                      <MenuItem value='Scientific'>Scientific</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='authorName'
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          type='text'
                          value={value}
                          onChange={onChange}
                          label='Author name'
                          placeholder='Author name'
                          error={Boolean(errors.authorName)}
                        />
                      )}
                    />
                    {errors.authorName && (
                      <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select label='language' defaultValue='english'>
                      <MenuItem value='english'>English</MenuItem>
                      <MenuItem value='Uzbek'>Uzbek</MenuItem>
                      <MenuItem value='Arabic'>Arabic</MenuItem>
                      <MenuItem value='Latin'>Latin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    multiline
                    maxRows={6}
                    minRows={4}
                    fullWidth
                    label='Reason for your contribution'
                    placeholder='Reason for your contribution'
                  />
                </Grid>
                <Grid item xs={4}>
                  <p style={{ margin: 0 }}>
                    <Checkbox checked={true} onChange={e => setRememberMe(e.target.checked)} />
                    <label>Hard copy</label>
                  </p>
                  <p style={{ margin: 0 }}>
                    <Checkbox checked={true} onChange={e => setRememberMe(e.target.checked)} />
                    <label>e book</label>
                  </p>
                  <p style={{ margin: 0 }}>
                    <Checkbox checked={true} onChange={e => setRememberMe(e.target.checked)} />
                    <label>audio book</label>
                  </p>
                </Grid>

                <Grid item xs={12} sx={{ mt: 5 }}>
                  <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
      >
        <Typography variant='h2' className='mb-2'>
          Your{' '}
          <Typography variant='h2' sx={{ color: 'error.main', display: 'inline-block' }}>
            Contribution
          </Typography>{' '}
          Helps Other to Learn
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Contribute
