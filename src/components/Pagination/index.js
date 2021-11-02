import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import generate from '_route/generate'
import useQueryParam from '_hooks/useQueryParam'

import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

const Comp = props => {
  const history = useHistory()
  const queryParams = useQueryParam()

  return (
    <Pagination
      className={props.className}
      page={props.page}
      count={props.pages}
      siblingCount={1}
      boundaryCount={2}
      variant="outlined"
      color="primary"
      renderItem={item => (
        <PaginationItem
          component={Link}
          disabled={item.page === props.page}
          to={generate(history.location.pathname, {
            ...queryParams,
            page: item.page
          })}
          {...item}
        />
      )}
    />
  )
}

export default Comp
