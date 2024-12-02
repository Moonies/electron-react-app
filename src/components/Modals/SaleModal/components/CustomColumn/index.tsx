import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { formatJPY } from 'utils/formatUtils'
import {
  Close as CancleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface CustomColumn {
  edit(id: GridRowId): () => void
  save(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  cancle(id: GridRowId): () => void
  rowModesModel: GridRowModesModel
}

export default function CustomColumn({
  cancle,
  edit,
  remove,
  rowModesModel,
  save,
}: CustomColumn): GridColDef[] {
  return [
    {
      field: 'number',
      headerName: '商品番号',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: '商品名',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: '数量',
      headerAlign: 'center',
      flex: 1,
      editable: true,
    },
    {
      field: 'price',
      headerName: '単価',
      type: 'number',
      headerAlign: 'center',
      flex: 1,
      valueFormatter: value => formatJPY(Number(value)),
    },
    {
      field: 'totalPrice',
      headerName: '金額',
      type: 'number',
      headerAlign: 'center',
      flex: 1,
      valueFormatter: value => formatJPY(Number(value)),
      valueGetter: (value, row) => {
        return row.quantity * row.price
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: GridRowParams) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={save(id)}
            />,
            <GridActionsCellItem
              icon={<CancleIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={cancle(id)}
              color='inherit'
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={edit(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={remove(id)}
            color='inherit'
          />,
        ]
      },
    },
  ]
}
