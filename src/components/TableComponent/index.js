import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { useStyles } from './TableComponent.style'
import TablePaginationComponent from '../TablePaginationComponent'

const TableComponent = React.memo(({
  data,
  tableHeadData,
  tableMetaData,
  handleChangePage,
  rowsPerPageOptions,
  handleChangeRowsPerPage
}) => {
  const classes = useStyles()
  const [ arrayData, setData ] = useState(data)
  const [ metaData, setMetaData ] = useState(tableMetaData)

  useEffect(() => {
    setData(data)
    setMetaData(tableMetaData)
  }, [ data, tableMetaData ])

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableHeadData.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayData.map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  {tableHeadData.map(column => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePaginationComponent
        metaData={metaData}
        rowsPerPageOptions={rowsPerPageOptions}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
})

export default TableComponent
