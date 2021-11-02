import React from 'react'
import { Container } from '@material-ui/core'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <>
      <Header/>

      <Container id="app-content">
        {children}
      </Container>

      <Footer/>
    </>
  )
}

export default Layout
