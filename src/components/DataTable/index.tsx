import React from 'react'
import {
  GridAutosizeOptions,
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridRowIdGetter,
  GridRowSelectionModel,
  GridValidRowModel,
} from '@mui/x-data-grid'
import { StyledStripedDataGrid, DataGridContainer } from './styles'
import { GridApiCommunity } from '@mui/x-data-grid/internals'

interface TableProps {
  data: any[]
  columns: GridColDef[]
  paginationModel: GridPaginationModel
  onPaginationModelChange: (newModel: GridPaginationModel) => void
  apiref: React.MutableRefObject<GridApiCommunity>
  getRowId: GridRowIdGetter<GridValidRowModel> | undefined
  checkboxSelection?: boolean
  disableRowSelectionOnClick?: boolean
  onSelected: (newModel: GridRowSelectionModel) => void
  autosizeOption?: GridAutosizeOptions
}

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
  }) => {
    return (
      <DataGridContainer>
        <StyledStripedDataGrid
          apiRef={apiref}
          getRowId={getRowId}
          rows={data}
          columns={columns}
          // autoHeight
          disableColumnMenu
          getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
          pageSizeOptions={[10, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          // rowSelectionModel={() => rowSelected}
          onRowSelectionModelChange={onSelected}
          // autosizeOnMount
          autosizeOptions={autosizeOption}
          getCellClassName={params => (params.colDef.type === 'number' ? 'right' : 'center')}
        />
      </DataGridContainer>
    )
  }
)

export default DataTable
