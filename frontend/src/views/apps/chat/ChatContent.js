// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/apps/chat/SendMsgForm'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

const ChatContent = ({
  msg,
  handleSendMsg,
  setMsg,
  sendMsg,
  mdAbove,
  handleLeftSidebarToggle,
  handleUserProfileRightSidebarToggle,
  questions
}) => {
  const renderContent = ({ msg, handleSendMsg, setMsg, questions }) => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'action.hover'
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {mdAbove ? null : (
              <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                <Icon icon='mdi:menu' />
              </IconButton>
            )}
            <Box
              onClick={handleUserProfileRightSidebarToggle}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                sx={{ mr: 4.5 }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      color: `primary.main`,
                      boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                      backgroundColor: `primary.main`
                    }}
                  />
                }
              >
                {true ? (
                  <MuiAvatar src={'https://via.placeholder.com/150'} alt={'avatar'} sx={{ width: 40, height: 40 }} />
                ) : (
                  <CustomAvatar skin='light' color={'#fff'} sx={{ width: 40, height: 40, fontSize: '1rem' }}>
                    {'Abdumajid'}
                  </CustomAvatar>
                )}
              </Badge>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'text.secondary' }}>{'Abdumajid'}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OptionsMenu
              menuProps={{ sx: { mt: 2 } }}
              icon={<Icon icon='mdi:dots-vertical' fontSize='1.25rem' />}
              iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
              options={['View Contact', 'Mute Notifications', 'Block Contact', 'Clear Chat', 'Report']}
            />
          </Box>
        </Box>

        <ChatLog questions={questions} />

        <SendMsgForm handleSendMsg={handleSendMsg} setMsg={setMsg} msg={msg} sendMsg={sendMsg} />
      </Box>
    )
  }

  return renderContent({ msg, handleSendMsg, setMsg, questions })
}

export default ChatContent
