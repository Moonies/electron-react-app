import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { Link } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import useMenu, { MenuItem } from './hooks/useMenu'
import React, { useState } from 'react'

export default function SideMenu({}: React.HTMLProps<HTMLInputElement>) {
  const { menuItem, handleListItemClick, selectedMenu } = useMenu()
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})
  const drawerWidth = 240

  const handleClick = (item: MenuItem) => {
    setOpen(prevOpen => ({ ...prevOpen, [item.text]: !prevOpen[item.text] }))
  }

  const renderMenuItem = (item: MenuItem, index: number, depth = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0

    return (
      <React.Fragment key={index}>
        <ListItemButton
          component={hasChildren ? 'div' : Link}
          to={hasChildren ? undefined : item.path}
          onClick={() => {
            if (hasChildren) {
              handleClick(item)
            } else {
              handleListItemClick(item.path || '')
            }
          }}
          selected={item.path === selectedMenu}
          sx={{ pl: 2 + depth * 2 }}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={item.text} />
          {hasChildren && (open[item.text] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={open[item.text]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {item.children!.map((child, childIndex) =>
                renderMenuItem(child, childIndex, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }
  return (
    <Drawer
      variant='permanent'
      anchor='left'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        display: 'flex',
        color: 'text.primary',
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflow: 'auto',
        }}
      >
        <List>{menuItem.map((item, index) => renderMenuItem(item as MenuItem, index))}</List>
      </Box>
    </Drawer>
  )
}
