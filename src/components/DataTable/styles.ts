import { styled, alpha } from '@mui/material/styles'
import { Box } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

const DataGridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  // height: 400,
  '& .MuiDataGrid-root': {
    border: `2px solid ${theme.palette.primary.dark}`,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))
const ODD_OPACITY = 0.2
const StyledStripedDataGrid = styled(DataGrid)(({ theme }) => ({
  fontSize: 14,
  // fontWeight: 'bold',
  [`.${gridClasses.cell}.right`]: {
    textAlign: 'right',
  },
  [`.${gridClasses.cell}.center`]: {
    textAlign: 'center',
  },
  '& .MuiDataGrid-columnHeaders': {
    color: theme.palette.text.primary,
    borderBottom: `4px solid ${theme.palette.divider}`,
  },
  [`& .${gridClasses.row}.odd`]: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[900],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}))
export { DataGridContainer, StyledStripedDataGrid }
