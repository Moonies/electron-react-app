import React, { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  debounce,
  Divider,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  ImageSearch as ImageSearchIcon,
} from '@mui/icons-material'
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
import { StyledButton, VisuallyHiddenInput } from 'styles/styles'
import AddComponentPartListDialog from 'components/Dialogs/AddComponentPartListDialog'
import { NewComponentDetail } from 'components/Dialogs/AddNewComponentListDialog'
import useNotification from 'hooks/useNotification'
import ImageViewerModal from '../ImageViewerModal'
import useProductImage, { UploadedImage } from './hooks/useProductImage'
import CustomerColumn from './components/CustomColumn'

export type ProductDetailModalProps = {
  id?: string
  productNumber: string
  productName: string
  stockQuantity: number
  productCost: number
  productPrice: number
  productUnit: string
  productPriceMargin?: number
  components: NewComponentDetail[]
  image?: UploadedImage
}

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ProductDetailModalProps) => Promise<void>
  initialData?: ProductDetailModalProps
  mode: 'add' | 'edit' | 'view'
}

const defaultFormData: ProductDetailModalProps = {
  // id:undefined,
  productNumber: '',
  productName: '',
  stockQuantity: 0,
  productCost: 0,
  productPrice: 0,
  productPriceMargin: 0,
  productUnit: '',
  components: [],
}

export default function ProductModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: ProductModalProps) {
  const [formData, setFormData] = useState(initialData ?? defaultFormData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const [openDialog, setOpenDialog] = useState(false)
  const [openImagePreview, setOpenImagePreview] = useState(false)

  const { setLoading } = useLoading()
  const { Slide } = SlideTransition({ direction: 'up' })
  const addNewComponentDataGridRef = useGridApiRef()
  const { notificationSnackbar } = useNotification()

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const { getProductImage, setUploadedImage, uploadedImage } = useProductImage()
  const {
    newComponentListData,
    handleAddNewComponent,
    handleCancelClick,
    handleDeleteClick,
    handleEditClick,
    handleRowEditStop,
    handleRowModesModelChange,
    handleSaveClick,
    processRowUpdate,
    rowModesModel,
    productUnitList,
    getProductUnit,
  } = useAddComponent(formData)

  const columns = CustomerColumn({
    cancle: handleCancelClick,
    edit: handleEditClick,
    save: handleSaveClick,
    remove: handleDeleteClick,
    rowModesModel,
  })

  useEffect(() => {
    getProductUnit()
    modalMode !== 'add' && formData.id && getProductImage(formData.id)
  }, [])

  const handleChange = (field: keyof ProductDetailModalProps, value: string | number) => {
    setFormData({ ...formData, [field]: value })
    // debouncedUpdate(field as keyof ProductDetailModalProps, value)
  }

  const handleSubmit = async () => {
    try {
      await onConfirm({
        ...formData,
        components: newComponentListData as NewComponentDetail[],
        image: uploadedImage,
      })
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const columnVisibilityModel = useMemo(() => {
    return {
      actions: modalMode !== 'view',
    }
  }, [modalMode])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.log(file.type)
        notificationSnackbar.error('file type is not impage file.')
        // setError(`File ${file.name} is not an allowed image type. Please select a JPEG, PNG, GIF, or WebP image.`);
        event.target.value = ''
        return
      }
      try {
        //if company id should auto update but at confirm is shuold be update
        // console.log('Upload successful', file)
        const newImage: UploadedImage = {
          file,
          previewUrl: URL.createObjectURL(file),
        }
        console.log(newImage.previewUrl)
        setUploadedImage(newImage)
      } catch (error) {
        // setPreviewUrl(null)
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log('An unknown error occurred')
        }
      }
    }
    // Reset the file input
    event.target.value = ''
  }

  const handlePreviewImage = () => {
    setOpenImagePreview(true)
  }

  const calculateProfitMargin = (cost: number, price: number) => price - cost

  //break for app crash
  const debouncedUpdate = debounce(
    (field: keyof ProductDetailModalProps, value: string | number) => {
      setFormData({ ...formData, [field]: value })
    },
    100
  )

  const clearFileUpload = () => {
    if (uploadedImage && uploadedImage.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl)
    }
    setUploadedImage(undefined)
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
      // fullWidth
      fullScreen
      // maxWidth='md'
      keepMounted
      scroll={'paper'}
      TransitionComponent={Slide}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {modalMode === 'add' ? '商品追加モーダルウィンドウ' : '商品編集モーダルウィンドウ'}
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <TextField
                label='商品番号'
                value={formData.productNumber}
                onChange={e => handleChange('productNumber', e.target.value)}
                fullWidth
                margin='normal'
                InputProps={{
                  readOnly: modalMode === 'view',
                }}
                required
                // sx={{ flex: 1 }}
              />
              <TextField
                label='商品品名'
                type='text'
                value={formData.productName}
                onChange={e => handleChange('productName', e.target.value)}
                fullWidth
                margin='normal'
                InputProps={{
                  readOnly: modalMode === 'view',
                }}
                required
                // sx={{ width: '20%' }}
              />
              <TextField
                label='単位'
                type='text'
                value={productUnitList.length > 0 ? formData.productUnit : ''} //for waiting productUnitList Loaded
                defaultValue={undefined}
                onChange={e => handleChange('productUnit', e.target.value)}
                // fullWidth
                margin='normal'
                select
                sx={{ width: '40%' }}
                InputProps={{
                  readOnly: modalMode === 'view',
                }}
                InputLabelProps={{
                  component: 'span',
                }}
              >
                {productUnitList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
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
                  readOnly: modalMode === 'view',
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
                  readOnly: modalMode === 'view',
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
                  // type='number'
                  value={formData.stockQuantity}
                  onChange={e => handleChange('stockQuantity', parseFloat(e.target.value))}
                  // fullWidth
                  margin='normal'
                  InputProps={{
                    readOnly: modalMode === 'view',
                    inputComponent: NumericFormatCustom as any,
                  }}
                  // sx={{ width: '20%' }}
                />
              )}
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
              <Box display={'flex'} alignItems={'end'}>
                <StyledButton
                  variant='outlined'
                  startIcon={<AddIcon />}
                  size='large'
                  onClick={() => setOpenDialog(true)}
                  sx={{ visibility: modalMode === 'view' ? 'hidden' : 'inherit' }}
                >
                  部品追加
                </StyledButton>
                {/* <Button
                onClick={() => setOpenDialog(true)}
                variant='outlined'
                sx={theme => ({
                  color: 'white',
                  visibility: modalMode === 'view' ? 'hidden' : 'inherit',
                  // height: '50%',
                })}
              >
                部品追加
              </Button> */}
              </Box>
              <Box gap={2} display={'flex'} flexDirection={'row'}>
                <Box display={'flex'} alignItems={'center'} mt={4}>
                  <Button
                    variant='contained'
                    startIcon={<FileUploadIcon />}
                    size='large'
                    sx={{ visibility: modalMode === 'view' ? 'hidden' : 'inherit' }}
                    tabIndex={-1}
                    role={undefined}
                    component='label'
                  >
                    商品画像追加
                    <VisuallyHiddenInput
                      type='file'
                      onChange={handleFileChange}
                      accept={ALLOWED_TYPES.join(',')}
                    />
                  </Button>
                </Box>
                {uploadedImage?.previewUrl && (
                  <Box gap={2} display={'flex'} flexDirection={'column'}>
                    <Divider>商品画像</Divider>
                    <StyledButton
                      variant='outlined'
                      startIcon={<ImageSearchIcon />}
                      size='large'
                      onClick={handlePreviewImage}
                      // sx={{ visibility: modalMode === 'view' ? 'hidden' : 'inherit' }}
                    >
                      表示
                    </StyledButton>
                    {modalMode !== 'view' && (
                      <StyledButton
                        variant='outlined'
                        startIcon={<DeleteIcon />}
                        size='large'
                        onClick={clearFileUpload}
                        // sx={{ visibility: modalMode === 'view' ? 'hidden' : 'inherit' }}
                      >
                        削除
                      </StyledButton>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            <DataTable
              data={newComponentListData}
              columns={columns}
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
              <AddComponentPartListDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={newComponent => {
                  setOpenDialog(false)
                  handleAddNewComponent(newComponent)
                }}
                // initialData={selectedOrder}
              />
            )}
            {openImagePreview && (
              <ImageViewerModal
                imagePreview={uploadedImage?.previewUrl ?? ''}
                onClose={() => setOpenImagePreview(false)}
                open={openImagePreview}
                productDetail={{ name: formData.productName, number: formData.productNumber }}
              />
            )}
          </Box>
        </DialogContent>
        {modalMode !== 'view' && (
          <DialogActions>
            <Button onClick={onClose} variant='contained' aria-label='close'>
              キャンセル
            </Button>
            <Button
              type='submit'
              variant='outlined'
              sx={{
                color: 'white',
              }}
              aria-label='close'
            >
              保存
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  )
}
