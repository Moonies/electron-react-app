import React from 'react'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import {
  Settings as SettingIcon,
  Menu as MenuIcon,
  RestartAlt as ResetIcon,
  CloudDownload as CloudDownloadIcon,
  Save as SaveIcon,
  AutoGraph as AutoGraphIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'

const options = ['時系列比較', '計画対実績比較']

interface SubHeader {
  onSubmit: () => void
}

export default function SubHeader({ onSubmit }: SubHeader) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const open = Boolean(anchorEl)
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <AppBar position='static' sx={{ display: 'flex' }}>
      <Toolbar>
        <Typography variant='h4' component='div' sx={{ flexGrow: 1 }}>
          今年は {dayjs().get('year')}
        </Typography>
        <IconButton
          id='setting-kpi'
          aria-label='setting'
          size='large'
          onClick={handleClickListItem}
        >
          <SettingIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <Menu
          id='setting-kpi'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
          sx={{
            '& .MuiMenuItem-root': {
              fontSize: '24px',
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={event => handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
        <IconButton aria-label='reset' size='large'>
          <ResetIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <IconButton aria-label='download' size='large'>
          <CloudDownloadIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <IconButton aria-label='save' size='large'>
          <SaveIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <IconButton aria-label='calculate' size='large' onClick={onSubmit}>
          <AutoGraphIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
