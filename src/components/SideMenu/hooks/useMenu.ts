import { useState } from 'react';
import { Dashboard, ShoppingCart, Receipt, Store, TrendingUp, Assessment, Category, Settings } from '@mui/icons-material'

export default function useMenu() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItem =
    [
      { text: 'Dashboard', icon: Dashboard, path: '/' },
      { text: 'Sales', icon: ShoppingCart, path: '/sales' },
      { text: 'Orders', icon: Receipt, path: '/orders' },
      { text: 'Store', icon: Store, path: '/store' },
      { text: 'KPI', icon: TrendingUp, path: '/kpi' },
      { text: 'Reports', icon: Assessment, path: '/reports' },
      { text: 'Products', icon: Category, path: '/products' },
      { text: 'Settings', icon: Settings, path: '/settings' },
    ];

  const handleListItemClick = (index: number) => {
    console.log(index)
    setSelectedIndex(index)
  }

  return { menuItem, selectedIndex, handleListItemClick }
} 