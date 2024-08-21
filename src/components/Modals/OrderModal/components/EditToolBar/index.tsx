import React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import {
  GridRowModes,
  GridRowsProp,
  GridRowModesModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
// import { randomId } from '@mui/x-data-grid-generator';

interface EditToolbarProps {
  setNewProductListData: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
  newProductListData: any[]
}

export function EditToolbar(props: EditToolbarProps) {
  const { setNewProductListData, setRowModesModel, newProductListData } = props

  const handleClick = () => {
    setNewProductListData(oldRows => {
      const newId = oldRows.length
      setRowModesModel(oldModel => ({
        ...oldModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'productNumber' },
      }))
      return [
        ...oldRows,
        { id: newId, productNumber: '', productName: '', qunatity: 0, isNew: true },
      ]
    })
  }

  return (
    <GridToolbarContainer>
      <Button startIcon={<AddIcon />} onClick={handleClick} sx={{ color: 'white' }}>
        Add New Product
      </Button>
    </GridToolbarContainer>
  )
}
