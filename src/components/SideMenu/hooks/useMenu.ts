import { useState } from 'react'
import {
  Dashboard,
  ShoppingCart,
  Receipt,
  Store,
  TrendingUp,
  Assessment,
  Category,
  Settings,
  SvgIconComponent,
  ManageAccounts,
  PrecisionManufacturing,
  Storage,
  LocalShipping,
  Storefront,
  ContentPasteSearch,
  ReceiptLong,
  Diversity3,
  Inventory,
} from '@mui/icons-material'
export interface MenuItem {
  text: string
  icon: SvgIconComponent
  path?: string
  children?: {
    text: string
    icon: SvgIconComponent
    path: string
  }[]
}
export default function useMenu() {
  const [selectedMenu, setSelectedMenu] = useState('/')

  const menuItem: MenuItem[] = [
    { text: 'Dashboard', icon: Dashboard, path: '/' },
    { text: 'Sales', icon: ShoppingCart, path: '/sales' },
    {
      text: 'Orders',
      icon: Receipt,
      children: [
        {
          text: 'Summary',
          icon: ContentPasteSearch,
          path: '/orders/summary',
        },
        {
          text: 'Shipping',
          icon: LocalShipping,
          path: '/orders/shipping',
        },
        {
          text: 'Invoice',
          icon: ReceiptLong,
          path: '/orders/invoice',
        },
      ],
    },
    { text: 'Purchase', icon: Inventory, path: '/purchase' },
    { text: 'KPI', icon: TrendingUp, path: '/kpi' },
    { text: 'Reports', icon: Assessment, path: '/reports' },
    { text: 'Products', icon: Category, path: '/products' },
    {
      text: 'Settings',
      icon: Settings,
      children: [
        {
          text: 'Account',
          icon: ManageAccounts,
          path: '/settings/account',
        },
        {
          text: 'My Company',
          icon: Store,
          path: '/settings/company',
        },
        {
          text: 'Customer',
          icon: Storefront,
          path: '/settings/customer',
        },
        {
          text: 'Supplier',
          icon: Diversity3,
          path: '/settings/supplier',
        },
        {
          text: 'Server',
          icon: Storage,
          path: '/settings/server',
        },
        {
          text: 'Component',
          icon: PrecisionManufacturing,
          path: '/settings/component',
        },
      ],
    },
  ]

  const handleListItemClick = (selectedMenu: string) => {
    setSelectedMenu(selectedMenu)
  }

  return { menuItem, selectedMenu, handleListItemClick }
}
