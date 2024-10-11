import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  ContentPasteSearch as DetailIcon,
} from '@mui/icons-material'
import DataTable from 'components/DataTable'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import { ComponentData } from 'api/component/getComponentList'
import useComponent from './hooks/useComponent'
import ComponentManagementModal, {
  ComponentDetail,
} from 'components/Modals/ComponentManagementModal'
import useLoading from 'hooks/useLoading'

export default function ComponentManagementPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const componentDataGridRef = useGridApiRef()
  const [filterValue, setFilterValue] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail>({
    id: '',
    componentNumber: '',
    componentName: '',
    lastestPriceDate: '',
    price: 0,
    inStock: 0,
    purchaseOrderList: [],
  })
  const { setLoading } = useLoading()

  const {
    columns,
    getComponentListData,
    componentListData,
    paginationModel,
    handlePaginationModelChange,
    categorySearch,
    handleChange,
    prepareCategorySearch,
    searchCriteria,
    handleSearch,
    getComponentDetail,
  } = useComponent()

  useEffect(() => {
    // getComponentListData()
    prepareCategorySearch
  }, [])

  const handleAddClick = () => {
    // setSelectedComponent(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = componentListData.find(item => item.id === selectedId)
      if (selectedData) {
        setModalMode('edit')
        // setSelectedComponent(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = componentListData.find(item => item.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: `この選ばれた　 ${selectedData.componentName}　を削除してもよろしいですか?`,
        })
        if (confirmed) {
          // Perform delete operation
          console.log('Delete confirmed')
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: any) => {
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

  const handleClear = () => {
    setFilterValue('')
  }

  const filteredRows = () => {
    return componentListData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    )
  }

  const handleViewDetailClick = async () => {
    setLoading(true)
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = componentListData.find(item => item.id === selectedId)
      if (selectedData) {
        const componentList = await getComponentDetail(selectedData.id)
        if (componentList) {
          let newInitComponent: ComponentDetail = {
            ...selectedData,
            purchaseOrderList: componentList.purchaseOrderList,
          }
          setSelectedComponent(newInitComponent)
          setModalOpen(true)
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
    setLoading(false)
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>仕入単価管理</Divider>
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
                  // value={filterValue}
                  onChange={e => handleChange('keyword', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {filterValue && (
                          <IconButton onClick={handleClear} edge='end'>
                            <ClearIcon />
                          </IconButton>
                        )}
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
              // width: '30%',
              display: 'flex',
              flexDirection: 'column',
              marginRight: 4,
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              <StyledButton
                variant='outlined'
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
              >
                検索
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              <StyledButton
                variant='outlined'
                startIcon={<DetailIcon />}
                size='large'
                onClick={handleViewDetailClick}
              >
                詳細
              </StyledButton>
            </Box>

            {/* <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
                sx={{ visibility: 'hidden' }}
              >
                追加
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<DeleteIcon />}
                size='large'
                onClick={handleDeleteClick}
                sx={{ visibility: 'hidden' }}
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
                sx={{ visibility: 'hidden' }}
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
            </Box> */}
          </Box>
        </Box>
        <DataTable
          data={componentListData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={componentDataGridRef}
          getRowId={row => row.id}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <ComponentManagementModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={selectedComponent}
        />
      )}
    </Box>
  )
}
