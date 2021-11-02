import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import { useStyles } from './TablePagination.style'
const TablePaginationComponent = React.memo(({ metaData, rowsPerPageOptions, handleChangePage, handleChangeRowsPerPage }) => {
  const classes = useStyles()
  return (
    <TablePagination
      classes={classes}
      rowsPerPageOptions={rowsPerPageOptions || [ 10, 25, 50, 100 ]}
      component="div"
      count={metaData.total || 0}
      rowsPerPage={metaData.limit || 10}
      page={metaData.page - 1 || 0}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => {
        return <span className="table-pagination__text-view ">{`Danh mục ${from}-${to} trong ${count} `}</span>
      }}
    />
  )
})
export default TablePaginationComponent
