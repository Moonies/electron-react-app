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
import { StyledButton } from 'styles/styles'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  UploadFile as UploadFileIcon,
  ContentPasteSearch as DetailIcon,
  ManageSearch as ManageSearchIcon,
} from '@mui/icons-material'
import DataTable from 'components/DataTable'
import useProduct, { ProductHistoryData } from './hooks/useProduct'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import ProductModal, { ProductDetailModalProps } from 'components/Modals/ProductModal'
import { ProductData } from 'api/product/getProductList'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import ProductHistoryModal from 'components/Modals/ProductHistoryModal'
import useLoading from 'hooks/useLoading'

export default function ProductPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailModalProps>()
  const [productHistory, setProductHistory] = useState<ProductHistoryData>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalHistory, setModalHistory] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { setLoading } = useLoading()
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
    getProductOrderHistoryList,
    handleAddNewProduct,
    totalRows,
    handleUpdateProductDetail,
    deleteProduct,
    prepareProductDetail,
  } = useProduct()

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
      const selectedData = productData.find(product => product.id === selectedId)
      if (selectedData) {
        // let prepareProductData: ProductDetailModalProps = {
        //   id: selectedData.id,
        //   productNumber: selectedData.number,
        //   productName: selectedData.name,
        //   stockQuantity: selectedData.inStock,
        //   productCost: selectedData.cost,
        //   productPrice: selectedData.price,
        //   productUnit: selectedData.productUnitId,
        //   productPriceMargin: selectedData.price - selectedData.cost,
        //   components: selectedData.components.map(item => ({
        //     id: item.number + item.name,
        //     name: item.name,
        //     number: item.number,
        //     quantity: item.quantity,
        //     price: item.price,
        //   })),
        // }
        const result = prepareProductDetail(selectedData)
        setModalMode('edit')
        setSelectedProduct(result)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel, productData])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = productData.find(product => product.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: `この選ばれたの商品番号　 ${selectedData.number}　を削除してもよろしいですか?`,
          // message: 'Are you sure you want to delete this Product Number: ' + selectedData.productId,
        })
        if (confirmed) {
          const response = await deleteProduct(selectedData.id)
          if (response) {
            handleSearch()
          }
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
  }, [selectionModel, productData])

  const handleModalConfirm = async (data: ProductDetailModalProps) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    // console.log('selected data', selectedProduct)
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'Are you sure you want to add data.',
    })
    if (confirmed) {
      if (modalMode === 'add') {
        const response = await handleAddNewProduct(data)
        if (response) {
          setModalOpen(false)
          handleSearch()
        }
      } else {
        let needUpdateQuantity = data.stockQuantity !== selectedProduct?.stockQuantity
        const response = await handleUpdateProductDetail(data, needUpdateQuantity)
        if (response) {
          setModalOpen(false)
          handleSearch()
        }
      }
      // addNewSaleData()
    }
  }

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = productData.find(product => product.id === selectedId)
      if (selectedData) {
        const result = prepareProductDetail(selectedData)
        setSelectedProduct(result)
        setModalOpen(true)
        setModalMode('view')
      }
    } else {
      notificationModal.error('詳細を表示するには、表の行を選択してください。')
    }
  }, [selectionModel, productData])

  const handleHistoryClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      setLoading(true)
      const selectedId = selectionModel[0]
      const selectedData = productData.find(product => product.id === selectedId)
      console.log(selectedData)
      let productHistoryData: ProductHistoryData
      if (selectedData) {
        notificationModal.warning('now function is not support.')
        const result = await getProductOrderHistoryList(selectedData.number)
        // if (result) {
        //   productHistoryData = {
        //     id: selectedData.id,
        //     productName: selectedData.productName,
        //     productNumber: selectedData.productNumber,
        //     orderHistoryList: result,
        //   }
        //   setProductHistory(productHistoryData)
        // }
        // setModalHistory(true)
        setLoading(false)
      }
    } else {
      notificationModal.error('商品履歴を表示するには、表の行を選択してください。')
    }
  }, [selectionModel])

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
                label='範疇項目'
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
                  label='キーワード検索'
                  value={searchCriteria.keyword}
                  onChange={e => handleChange('keyword', e.target.value)}
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
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
              >
                検索
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<ManageSearchIcon />}
                size='large'
                onClick={handleHistoryClick}
                // sx={{ visibility: 'hidden' }}
              >
                商品履歴
              </StyledButton>
            </Box>
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
              {/* waiting for comfirm */}
              {/* <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                // onClick={handleExportPdf}
              >
                データ出力
              </StyledButton> */}
              {/* 製品注文履歴 */}
              <StyledButton
                variant='outlined'
                startIcon={<DetailIcon />}
                size='large'
                onClick={handleViewDetailClick}
                // sx={{ visibility: 'hidden' }}
              >
                詳細
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
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          totalRows={totalRows}
          paginationMode={'server'}
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
      {modalHistory && productHistory && (
        <ProductHistoryModal
          open={modalHistory}
          onClose={() => setModalHistory(false)}
          initialData={productHistory}
        />
      )}
    </Box>
  )
}
