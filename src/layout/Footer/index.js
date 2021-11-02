import React from 'react'

const Footer = props => {
  return (
    <footer id="app-footer" className="app-footer">
      &copy; {new Date().getFullYear()}&nbsp;
      <a href="https://github.com/danh20051995" rel="noopener noreferrer" target="_blank">danh.danh20051995@gmail.com</a>
    </footer>
  )
}

export default Footer
