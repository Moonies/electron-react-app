import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { StyledButton } from '../../styles/styles'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material'
import DataTable from 'components/DataTable'
import useProduct from './hooks/useProduct'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import ProductModal from 'components/Modals/ProductModal'
import { ProductData } from 'api/product/getProductList'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { useDispatch } from 'react-redux'
import useNotification from 'hooks/useNotification'

export default function ProductPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductData | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const {
    categorySearch,
    columns,
    prepareCategorySearch,
    handleSearch,
    productData,
    searchCriteria,
    handleChange,
    handlePaginationModelChange,
    paginationModel,
  } = useProduct()
  const dispatch = useDispatch()

  const productDataGridRef = useGridApiRef()

  useEffect(() => {
    if (productDataGridRef.current) {
      productDataGridRef.current.autosizeColumns({
        // columns: ['customerName', 'productName'],
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [productData])

  useEffect(() => {
    prepareCategorySearch
  }, [])

  const handleAddClick = () => {
    setSelectedProduct(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = productData.find(product => product.productId === selectedId)
      if (selectedData) {
        setModalMode('edit')
        setSelectedProduct(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = productData.find(product => product.productId === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: 'Are you sure you want to delete this Product Number: ' + selectedData.productId,
        })
        if (confirmed) {
          // Perform delete operation
          console.log('Delete confirmed')
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('Please select a row in the table to delete.')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: ProductData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      const confirmed = await openConfirmModal({
        title: '確認してください',
        message: 'Are you sure you want to add data.',
      })
      if (confirmed) {
        // Perform delete operation
        console.log('Add confirmed')
      } else {
        console.log('Add cancelled')
      }
      // addNewSaleData()
    } else {
    }
    // After successful add/edit, refetch the data
    // await fetchSalesData(paginationModel);
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>商品管理</Divider>
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 2,
          p: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '40%',
            }}
          >
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <TextField
                name='category'
                value={searchCriteria.category}
                select
                label='範疇'
                id='category-sale'
                onChange={e => handleChange('category', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'category-sale-label',
                  htmlFor: 'category',
                  component: 'span',
                }}
              >
                {categorySearch?.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.display}
                  </MenuItem>
                ))}
              </TextField>
              <Box display={'flex'} flex={1}>
                <TextField
                  fullWidth
                  name='keyword'
                  label='検索'
                  value={searchCriteria.keyword}
                  onChange={e => handleChange('keyword', e.target.value)}
                  InputProps={{
                    style: { fontSize: '1.2rem' },
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleSearch} edge='end'>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Divider orientation='vertical' sx={{ marginLeft: 'auto' }}></Divider>
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
              >
                追加
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<DeleteIcon />}
                size='large'
                onClick={handleDeleteClick}
              >
                削除
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                onClick={handleEditClick}
              >
                編集
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
                visible
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton variant='outlined' startIcon={<UploadFileIcon />} size='large'>
                自動アプロード
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                // onClick={handleExportPdf}
              >
                データ出力
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <DataTable
          data={productData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={productDataGridRef}
          getRowId={row => row.productId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <ProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedProduct}
          mode={modalMode}
        />
      )}
    </Box>
  )
}
