import { styled, alpha } from '@mui/material/styles'
import { Button, Divider, Box } from '@mui/material'
import { borderColor } from '@mui/system'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { red } from '@mui/material/colors'

const StyledDivider = styled(Divider)(({ theme }) => ({
  '&.MuiDivider-root': {
    borderColor: theme.palette.primary.dark,
    '&::before': {
      borderTop: `thin solid ${theme?.palette.primary.dark}`,
    },
    '&::after': {
      borderTop: `thin solid ${theme?.palette.primary.dark}`,
    },
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  // height: 27, // Approximately 36px
  // minWidth: 'unset',
  // padding: '4.5pt 12pt', // Approximately 6px 16px
  width: '120pt',
  justifyContent: 'flex-start',
  fontcolor: '#fffff',
  '&.MuiButton-root': {
    color: '#ffffff',
  },
}))
const DataGridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  height: 400,
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
const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  // backgroundColor: theme.palette.grey[900],
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
export { StyledDivider, StyledButton, DataGridContainer, StripedDataGrid }
