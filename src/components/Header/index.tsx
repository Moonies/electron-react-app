import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'

const drawerWidth = 240

export default function Header({}: React.HTMLProps<HTMLInputElement>) {
  return (
    <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant='h6' noWrap>
          早楽経営
        </Typography>
        {/* <Button color="inherit" component={Link} to="/">Home</Button> */}
      </Toolbar>
    </AppBar>
  )
}
