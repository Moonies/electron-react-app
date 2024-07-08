import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, makeStyles } from '@mui/material';
import { Link } from 'react-router-dom';
import useMenu from './hooks/useMenu'

const drawerWidth = 240;


export default function SideMenu({ }: React.HTMLProps<HTMLInputElement>) {
  const { menuItem, handleListItemClick, selectedIndex } = useMenu()
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        display: 'flex',
        color: 'text.primary'
      }}
    >
      {/* <div className={style.toolbar} /> */}
      <Toolbar />
      <Box sx={{
        overflow: 'auto'
      }}>
        <List>
          {menuItem.map((item, index) => {
            const Icon = item.icon;
            return (
              <ListItemButton key={item.text}
                component={Link}
                to={item.path}
                onClick={() => handleListItemClick(index)}
                selected={index == selectedIndex}
              >
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  )
}
