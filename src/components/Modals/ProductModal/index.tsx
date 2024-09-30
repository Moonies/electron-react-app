import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  debounce,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ComponentDetail, ProductData } from 'api/product/getProductList'
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
import NumericFormatCustom from 'components/NumericFormat'

interface SalesModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ProductData) => Promise<void>
  initialData?: ProductDetail
  mode: 'add' | 'edit' | 'view'
}
type ProductDetail = {
  productId: string
  productName: string
  stockQuantity: number
  productCost: number
  productPrice: number
  productUnit: string
  productPriceMargin?: number
  component: ComponentDetail[]
}
const defaultFormData: ProductDetail = {
  productId: '',
  productName: '',
  stockQuantity: 0,
  productCost: 0,
  productPrice: 0,
  productPriceMargin: 0,
  productUnit: '',
  component: [],
}
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const ProductModal: React.FC<SalesModalProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState(initialData ?? defaultFormData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const [openDialog, setOpenDialog] = useState(false)
  const [isFormatted, setIsFormatted] = useState(false)
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
  } = useAddComponent(formData)

  useEffect(() => {
    if (modalMode === 'add') setFormData(defaultFormData)
  }, [defaultFormData])

  const handleChange = (field: keyof ProductDetail, value: string | number) => {
    // setFormData({ ...formData, [field]: value })
    debouncedUpdate(field as keyof ProductDetail, value)
  }

  const handleSubmit = async () => {
    // setLoading(true)
    try {
      await onConfirm({ ...formData, component: newComponentListData as ComponentDetail[] })
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

  // setFormData(prev => ({ ...prev, ['productPriceMargin']: price - cost }))
  const calculateProfitMargin = (cost: number, price: number) => price - cost

  //break for app crash
  const debouncedUpdate = debounce((field: keyof ProductDetail, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }, 300)

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
              value={formData.productCost}
              onChange={e =>
                handleChange('productCost', e.target.value ? parseFloat(e.target.value) : 0)
              }
              // fullWidth
              margin='normal'
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                inputProps: {
                  maxLength: 13,
                },
              }}
              onContextMenu={e => e.preventDefault()} // Optionally prevent context menu
              variant='outlined'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='単価'
              value={formData.productPrice}
              onChange={e =>
                handleChange('productPrice', e.target.value ? parseFloat(e.target.value) : 0)
              }
              // fullWidth
              margin='normal'
              onTouchStart={e => e.preventDefault()}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                inputProps: {
                  maxLength: 13,
                },
              }}

              // sx={{ width: '20%' }}
            />
            <TextField
              label='粗利益'
              value={calculateProfitMargin(formData.productCost, formData.productPrice)}
              // onChange={e => handleChange('productPriceMargin', parseFloat(e.target.value))}
              // fullWidth
              InputProps={{
                readOnly: true,
                inputComponent: NumericFormatCustom as any,
              }}
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
