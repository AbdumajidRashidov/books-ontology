// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Chat App Components Imports
import UserProfileLeft from 'src/views/apps/chat/UserProfileLeft'

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const SidebarLeft = props => {
  // ** Props
  const {
    store,
    hidden,
    mdAbove,
    dispatch,
    statusObj,
    userStatus,
    selectChat,
    getInitials,
    sidebarWidth,
    setUserStatus,
    leftSidebarOpen,
    removeSelectedChat,
    userProfileLeftOpen,
    formatDateToMonthShort,
    handleLeftSidebarToggle,
    handleUserProfileLeftSidebarToggle
  } = props

  // ** States
  const [active, setActive] = useState(false)

  const handleChatClick = (type, id) => {
    setActive(true)
  }

  const renderChats = () => {
    return [
      {
        chat: {
          id: '12',
          fullName: 'Alice',
          status: 'online',
          lastMessage: {
            message: 'Hello',
            time: '2021-08-10T07:46:00.000Z'
          },
          avatar: 'https://via.placeholder.com/150x150',
          avatarColor: 'light-primary',
          unseenMsgs: 0
        }
      }
    ].map((chat, index) => {
      const { lastMessage } = chat.chat

      return (
        <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
          <ListItemButton
            disableRipple
            onClick={() => handleChatClick('chat', chat.id)}
            sx={{
              px: 2.5,
              py: 2.5,
              width: '100%',
              borderRadius: 1,
              alignItems: 'flex-start'
            }}
          >
            <ListItemAvatar sx={{ m: 0 }}>
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      color: `${statusObj[chat.status]}.main`,
                      backgroundColor: `${statusObj[chat.status]}.main`,
                      boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                    }}
                  />
                }
              >
                {chat.avatar ? (
                  <MuiAvatar
                    src={chat.avatar}
                    alt={chat.fullName}
                    sx={{
                      width: 40,
                      height: 40,
                      outline: theme => `2px solid ${theme.palette.common.white}`
                    }}
                  />
                ) : (
                  <CustomAvatar
                    color={chat.avatarColor}
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: '1rem'
                    }}
                  >
                    {chat.fullName}
                  </CustomAvatar>
                )}
              </Badge>
            </ListItemAvatar>
            <ListItemText
              sx={{
                my: 0,
                ml: 4,
                mr: 1.5
              }}
              primary={
                <Typography noWrap sx={{ ...{ color: 'text.secondary' } }}>
                  {chat.fullName}
                </Typography>
              }
              secondary={
                <Typography noWrap variant='body2' sx={{ ...{ color: 'text.disabled' } }}>
                  {lastMessage ? lastMessage.message : null}
                </Typography>
              }
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <Typography sx={{ whiteSpace: 'nowrap', color: 'common.white' }}>
                <>{lastMessage ? formatDateToMonthShort(lastMessage.time, true) : new Date()}</>
              </Typography>
              {chat.chat.unseenMsgs && chat.chat.unseenMsgs > 0 ? (
                <Chip
                  color='error'
                  label={chat.chat.unseenMsgs}
                  sx={{
                    mt: 0.5,
                    height: 18,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '& .MuiChip-label': { pt: 0.25, px: 1.655 }
                  }}
                />
              ) : null}
            </Box>
          </ListItemButton>
        </ListItem>
      )
    })
  }

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            overflow: 'hidden',
            width: sidebarWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            px: 5.5,
            py: 3.5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          {store && store.userProfile ? (
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              sx={{ mr: 4.5 }}
              onClick={handleUserProfileLeftSidebarToggle}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: `${statusObj[userStatus]}.main`,
                    backgroundColor: `${statusObj[userStatus]}.main`,
                    boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                  }}
                />
              }
            >
              <MuiAvatar
                src={store.userProfile.avatar}
                alt={store.userProfile.fullName}
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
              />
            </Badge>
          ) : null}
          <TextField
            fullWidth
            size='small'
            value={'Chats'}
            placeholder='Search for contact...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='mdi:magnify' fontSize='1.25rem' />
                </InputAdornment>
              )
            }}
          />
          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='mdi:close' fontSize='1.375rem' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(5, 3, 3) }}>
              <Typography variant='h6' sx={{ ml: 2, mb: 4, color: 'primary.main' }}>
                Chats
              </Typography>
              <List sx={{ mb: 7.5, p: 0 }}>{renderChats()}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>
    </div>
  )
}

export default SidebarLeft
