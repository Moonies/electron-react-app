import { useState, useEffect, useCallback, forwardRef, useMemo } from 'react'
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Slide,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { debounce } from '@mui/material/utils'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { api } from 'api/index'
import { ComponentIdData } from 'api/component/getComponentIdList'
import { TransitionProps } from '@mui/material/transitions'
import useAddComponent from './hooks/useAddComponent'
import DataTable from 'components/DataTable'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  useGridApiRef,
} from '@mui/x-data-grid'
interface Option {
  label: string
  id: number
}
interface PurchaseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: PurchaseData) => Promise<void>
  initialData?: PurchaseData
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData: PurchaseData = {
  purchaseId: '',
  invoiceNumber: '',
  supplierCompanyId: '',
  supplierCompanyName: '',
  component: [],
  orderRequestEmployeeName: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  purchaseApprovedDate: dayjs(),
  purchaseReciptDate: dayjs(),
  status: null,
}
export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  const [formData, setFormData] = useState<PurchaseData>(initialData ?? defaultFormData)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [componentIdList, setComponentIdList] = useState<ComponentIdData[]>([])
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState(mode)
  const addNewComponentDataGridRef = useGridApiRef()

  const {
    columns,
    componentData,
    getCustomerList,
    getUserList,
    userListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    newComponentListData,
  } = useAddComponent(formData)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (field: keyof PurchaseData, value: string | number) => {
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

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const fetchedOptions = await api.component().getComponentIdList(query)
          setComponentIdList(fetchedOptions.data ?? [])
        } catch (error) {
          console.error('Error fetching options:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedFetchOptions(inputValue)
  }, [inputValue, debouncedFetchOptions])

  const _mockOption: Option[] = [
    { label: 'aaaaa', id: 1 },
    { label: 'bbdbd', id: 2 },
    { label: 'cdfasd', id: 3 },
    { label: 'qwerty', id: 4 },
    { label: 'asddffg', id: 5 },
    { label: 'minoiui', id: 6 },
  ]

  const statusList = [
    { label: '見積書依頼', value: 'invoice_pending' },
    { label: '配達中', value: 'on_delivery' },
    { label: '入庫済', value: 'delivered' },
    { label: '返品中', value: 'rejected' },
    { label: 'キャンセル', value: 'cancelled' },
  ]

  const columnVisibilityModel = useMemo(() => {
    return {
      actions: modalMode !== 'view',
    }
  }, [modalMode])

  const Transition = useCallback(
    forwardRef(function Transition(
      props: TransitionProps & {
        children: React.ReactElement<any, any>
      },
      ref: React.Ref<unknown>
    ) {
      return <Slide direction='up' ref={ref} {...props} />
    }),
    []
  )

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
                icon={<CancelIcon />}
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

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      // fullWidth
      // maxWidth='md'
      fullScreen
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {mode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'}
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <DatePicker
              label='登録日付'
              value={dayjs(formData.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='伝票番号'
              value={formData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              // fullWidth
              margin='normal'
            />
            <TextField
              label='顧客名称'
              value={formData.supplierCompanyName}
              onChange={e => handleChange('supplierCompanyName', e.target.value)}
              margin='normal'
              // sx={{ flex: 1 }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='発注承認済'
              value={dayjs(formData.purchaseApprovedDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <DatePicker
              label='入庫承認済'
              value={dayjs(formData.purchaseReciptDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='状態'
              value={formData.status ?? ''}
              onChange={e => handleChange('status', e.target.value)}
              margin='normal'
              select
              sx={{ flex: 1 }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {statusList.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Box display={'flex'} alignItems={'end'}>
              <Button
                // onClick={() => setOpenDialog(true)}
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
            <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ marginTop: 2, width: '35%' }}
              renderInput={params => <TextField {...params} label='担当者' />}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            {/* <Autocomplete
              // fullWidth
              options={componentIdList}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                  <Box key={key} component='li' {...optionProps}>
                    {option.componentNumber + '  :  ' + option.componentName}
                  </Box>
                )
              }}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option
                }
                if (option && option.componentNumber) {
                  return option.componentNumber
                }
                return ''
              }}
              freeSolo
              // disableClearable
              sx={{ marginTop: 2, flex: 1 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='商品番号'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color='inherit' size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
                setFormData(prev => ({ ...prev, ['productId']: newInputValue }))
              }}
              isOptionEqualToValue={(option, value) =>
                option.componentNumber === value.componentNumber
              }
              value={formData.componentNumber}
            />
            <TextField
              label='数量'
              type='number'
              value={formData.quantity}
              onChange={e => handleChange('quantity', parseFloat(e.target.value))}
              margin='normal'
            /> */}
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
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant='contained'
          // sx={theme => ({
          //   color: 'white',
          // })}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant='outlined'
          sx={theme => ({
            color: 'white',
          })}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}
