import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ProductData } from 'api/product/getProductList'
import SlideTransition from 'components/Transition/Slide'
import DataTable from 'components/DataTable'
import useLoading from 'hooks/useLoading'
import useAddComponent from './hooks/useAddComponent'
import AddNewComponentListDialog from 'components/Dialogs/AddNewComponentListDialog'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  useGridApiRef,
} from '@mui/x-data-grid'
import CustomFooter from './components/CustomFooter'
import { ComponentData } from 'api/component/getComponentList'

interface SalesModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ProductData) => Promise<void>
  initialData?: ProductData
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData: ProductData = {
  productId: '',
  productName: '',
  stockQuantity: 0,
  productCost: 0,
  productPrice: 0,
  productUnit: '',
}
const ProductModal: React.FC<SalesModalProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductData>(defaultFormData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const [openDialog, setOpenDialog] = useState(false)

  // const [loading, setLoading] = useState(false)
  const { setLoading } = useLoading()
  const { Slide } = SlideTransition({ direction: 'up' })
  const addNewComponentDataGridRef = useGridApiRef()

  const {
    newComponentListData,
    columns,
    handleAddNewComponent,
    handleCancelClick,
    handleDeleteClick,
    handleEditClick,
    handleRowEditStop,
    handleRowModesModelChange,
    handleSaveClick,
    processRowUpdate,
    rowModesModel,
    // geTotalRemainComponent,
  } = useAddComponent()

  useEffect(() => {
    if (modalMode !== 'add' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  // useEffect(() => {
  //   geTotalRemainComponent(newComponentListData)
  // }, [newComponentListData])

  const handleChange = (field: keyof ProductData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onConfirm(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const productUnitList = [
    {
      value: 'piece',
      label: '個',
    },
    {
      value: 'unit',
      label: '台',
    },
    {
      value: 'sheet',
      label: '枚',
    },
    {
      value: 'set',
      label: 'セット',
    },
  ]

  const updatedColumns = columns.map(column => {
    if (column.field === 'actions') {
      return {
        ...column,
        getActions: ({ id }: any) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label='Save'
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CloseIcon />}
                label='Cancel'
                className='textPrimary'
                onClick={handleCancelClick(id)}
                color='inherit'
              />,
            ]
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              className='textPrimary'
              onClick={handleEditClick(id)}
              color='inherit'
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label='Delete'
              onClick={handleDeleteClick(id)}
              color='inherit'
            />,
          ]
        },
      }
    }
    return column
  })

  const columnVisibilityModel = useMemo(() => {
    return {
      actions: modalMode !== 'view',
    }
  }, [modalMode])

  const CustomFooterStatusComponent = (totalPriceColumnField: string) => {
    return (
      <Box sx={{ p: 1, display: 'flex' }}>
        <Typography>Test Footer</Typography>
      </Box>
    )
  }
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      fullScreen
      // maxWidth='md'
      keepMounted
      scroll={'paper'}
      TransitionComponent={Slide}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {modalMode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'}
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='商品番号'
              value={formData.productId}
              onChange={e => handleChange('productId', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='商品品名'
              type='text'
              value={formData.productName}
              onChange={e => handleChange('productName', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='単位'
              type='text'
              value={formData.productUnit}
              defaultValue={undefined}
              onChange={e => handleChange('productUnit', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '40%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {productUnitList.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='原価'
              type='number'
              value={formData.productCost}
              onChange={e => handleChange('productCost', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='単価'
              type='number'
              value={formData.productPrice}
              onChange={e => handleChange('productPrice', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='粗利益'
              type='number'
              value={formData.productPrice}
              onChange={e => handleChange('productPrice', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            {modalMode !== 'add' && (
              <TextField
                label='在庫数'
                type='number'
                value={formData.stockQuantity}
                onChange={e => handleChange('stockQuantity', parseFloat(e.target.value))}
                // fullWidth
                margin='normal'
                // sx={{ width: '20%' }}
              />
            )}
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            {/* <TextField
              label='在庫数'
              type='number'
              value={formData.stockQuantity}
              onChange={e => handleChange('stockQuantity', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            /> */}
            {/* <TextField
              label='単位'
              type='text'
              value={formData.productUnit}
              defaultValue={undefined}
              onChange={e => handleChange('productUnit', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '40%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {productUnitList.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField> */}
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Box display={'flex'} alignItems={'end'}>
              <Button
                onClick={() => setOpenDialog(true)}
                variant='outlined'
                sx={theme => ({
                  color: 'white',
                  visibility: modalMode === 'view' ? 'hidden' : 'inherit',
                  // height: '50%',
                })}
              >
                Add Component
              </Button>
            </Box>
          </Box>
          <DataTable
            data={newComponentListData}
            columns={updatedColumns}
            apiref={addNewComponentDataGridRef}
            // getRowId={row => row.productNumber}
            onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
            sx={{ height: 475, mt: 2 }}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            disableColumnSelector
            columnVisibilityModel={columnVisibilityModel}
            isCellEditable={() => modalMode !== 'view'}
            slots={{
              footer: CustomFooter,
            }}
          />
          {openDialog && (
            <AddNewComponentListDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onSubmit={newComponent => {
                setOpenDialog(false)
                handleAddNewComponent(newComponent)
              }}
              // initialData={selectedOrder}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant='outlined'
          sx={{
            color: 'white',
          }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductModal
