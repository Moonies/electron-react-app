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
    { text: 'お知らせ', icon: Dashboard, path: '/' },
    { text: '売上管理', icon: ShoppingCart, path: '/sales' },
    {
      text: '受注管理',
      icon: Receipt,
      path: '/orders',
      // children: [
      //   {
      //     text: 'Summary',
      //     icon: ContentPasteSearch,
      //     path: '/orders/summary',
      //   },
      //   {
      //     text: 'Shipping',
      //     icon: LocalShipping,
      //     path: '/orders/shipping',
      //   },
      //   {
      //     text: 'Invoice',
      //     icon: ReceiptLong,
      //     path: '/orders/invoice',
      //   },
      // ],
    },
    { text: '仕入管理', icon: Inventory, path: '/purchase' },
    { text: 'KPI', icon: TrendingUp, path: '/kpi' },
    { text: 'レポート', icon: Assessment, path: '/reports' },
    { text: '商品管理', icon: Category, path: '/products' },
    {
      text: '仕入単価管理',
      icon: PrecisionManufacturing,
      path: '/component',
    },
    {
      text: '設定',
      icon: Settings,
      children: [
        {
          text: 'アカウント管理',
          icon: ManageAccounts,
          path: '/settings/account',
        },
        {
          text: '企業情報',
          icon: Store,
          path: '/settings/mycompany',
        },
        {
          text: '顧客管理',
          icon: Storefront,
          path: '/settings/customer',
        },
        {
          text: '仕入先管理',
          icon: Diversity3,
          path: '/settings/supplier',
        },
        {
          text: 'サーバー情報',
          icon: Storage,
          path: '/settings/server',
        },
      ],
    },
  ]

  const handleListItemClick = (selectedMenu: string) => {
    setSelectedMenu(selectedMenu)
  }

  return { menuItem, selectedMenu, handleListItemClick }
}
