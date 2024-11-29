import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid'
import { formatJPY } from 'utils/formatUtils'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface CustomerColumn {
  edit(id: GridRowId): () => void
  save(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  cancle(id: GridRowId): () => void
  rowModesModel: GridRowModesModel
}
export default function CustomerColumn({
  cancle,
  edit,
  save,
  remove,
  rowModesModel,
}: CustomerColumn): GridColDef[] {
  return [
    {
      field: 'number',
      headerName: '部品番号',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: '部品名',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: '数量',
      headerAlign: 'center',
      type: 'number',
      flex: 1,
      editable: true,
    },
    // {
    //   field: 'totalQuantity',
    //   headerName: '合計残り',
    //   headerAlign: 'center',
    //   flex: 1,
    // },
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
              onClick={save(id)}
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
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
