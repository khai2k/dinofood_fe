import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { useStyles } from './SelectComponent.style'

export const SelectComponent = ({
  name,
  value,
  label,
  listMenu,
  handleChange,
  displayEmpty
}) => {
  const classes = useStyles()
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label" shrink={displayEmpty}>{label}</InputLabel>
      <Select
        id="demo-simple-select-outlined"
        labelId="demo-simple-select-outlined-label"
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        displayEmpty={displayEmpty}
        className={classes.select}
      >
        {listMenu.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectComponent
