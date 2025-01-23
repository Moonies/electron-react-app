import React, { useEffect } from 'react'
import {
  GridAutosizeOptions,
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridRowIdGetter,
  GridRowSelectionModel,
  GridRowsProp,
  GridValidRowModel,
  GridRowModes,
} from '@mui/x-data-grid'
import { StyledStripedDataGrid, DataGridContainer } from './styles'
import { DataGridProps, GridApiCommunity } from '@mui/x-data-grid/internals'
import { SxProps } from '@mui/system'
import { SixKPlus } from '@mui/icons-material'

interface CustomTableProps {
  data: any[] | GridRowsProp
  columns: GridColDef[]
  paginationModel?: GridPaginationModel
  onPaginationModelChange?: (newModel: GridPaginationModel) => void
  apiref: React.MutableRefObject<GridApiCommunity>
  getRowId?: GridRowIdGetter<GridValidRowModel>
  checkboxSelection?: boolean
  disableRowSelectionOnClick?: boolean
  onSelected: (newModel: GridRowSelectionModel) => void
  autosizeOption?: GridAutosizeOptions
  totalRows?: number
  sx?: SxProps
}
type TableProps = CustomTableProps & Omit<DataGridProps, keyof CustomTableProps>

const DataTable = React.memo<TableProps>(
  ({
    data,
    columns,
    paginationModel,
    onPaginationModelChange,
    apiref,
    getRowId,
    checkboxSelection = false,
    disableRowSelectionOnClick = false,
    onSelected,
    autosizeOption,
    totalRows,
    sx = { height: 400 },
    ...props
  }) => {
    return (
      <DataGridContainer sx={sx}>
        <StyledStripedDataGrid
          apiRef={apiref}
          getRowId={getRowId}
          rows={data}
          rowCount={totalRows}
          columns={columns}
          // autoHeight
          disableColumnMenu
          getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          // rowSelectionModel={() => rowSelected}
          onRowSelectionModelChange={onSelected}
          // autosizeOnMount
          paginationMode={totalRows ? 'server' : 'client'} //when change to fetch by api should be 'server' only
          autosizeOptions={autosizeOption}
          getCellClassName={params => {
            if (
              params.colDef.field.includes('quantity') ||
              params.colDef.field.includes('inStock')
            ) {
              return 'center'
            }
            return params.colDef.type === 'number' ? 'right' : 'center'
          }}
          // sx={sx}
          {...props}
        />
      </DataGridContainer>
    )
  }
)

export default DataTable
