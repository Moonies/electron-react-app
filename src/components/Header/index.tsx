import React, { useEffect, useState } from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import useAuth from 'hooks/useAuth'
import { AuthData } from 'api/user/checkAuth'
import { useNavigate } from 'react-router-dom'
import { useConfirmModal } from 'hooks/useConfirmModal'

interface HeaderProps {
  loginStatus: boolean
}
const Header: React.FC<HeaderProps> = ({ loginStatus }) => {
  const { getCurrentUser, removeUserLogin } = useAuth()
  const [userDetail, setUserDetail] = useState<AuthData | null>()
  const navigate = useNavigate()
  const { openConfirmModal } = useConfirmModal()

  useEffect(() => {
    const result = getCurrentUser()
    setUserDetail(result)
  }, [loginStatus])

  const handleLogout = async () => {
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'Confirm to Logout \n logout is not close or exit program, should be careful',
    })
    if (confirmed) {
      removeUserLogin()
      navigate('/')
      window.location.reload()
    }
  }
  return (
    <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant='h6' noWrap>
          早楽経営
        </Typography>
        <Box display={'flex'} ml='auto' gap={4}>
          <Typography alignContent={'center'}>user: {userDetail?.id}</Typography>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default Header
