import React from 'react'

const Loading = ({ show = false, ...props }) => {
  return (
    <div className="app-loading" style={{ display: show ? '' : 'none' }}>
      <div className="loading-content">
        <span/>
        <span/>
        <span/>
        <span/>
        <span/>
      </div>
    </div>
  )
}

export default Loading
