import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'

import StoreAPI from '_api/_store'
import { notify, ensureArray, ensureObject, getApiErrorMessage, toURL, vndCurrency } from '_utils/helpers'

import { Box, Grid, Hidden } from '@material-ui/core'
import Image from '_components/Image'
import Rating from '_components/Rating'
import Cart from './Cart'

const StoreDetail = props => {
  const { slug } = useParams()
  const menuRef = useRef('menuRef')
  const cartRef = useRef('cartRef')
  const sideBarRef = useRef('sideBarRef')
  const [ menu, setMenu ] = useState({})
  const [ store, setStore ] = useState({})
  const [ activeKey, setActiveKey ] = useState('')

  /**
   * Fetch store by parameters
   */
  const fetchStore = slug => {
    StoreAPI
      .detail({ slug })
      .then(({ data }) => {
        setStore({
          ...data,
          banner: Array.isArray(data.photos) && data.photos.length
            ? data.photos[data.photos.length - 1]
            : {}
        })
      })
      .catch(error => {
        notify({
          type: 'error',
          message: getApiErrorMessage(error)
        })
      })
  }

  /**
   * Fetch store's menu
   */
  const fetchMenu = () => {
    StoreAPI
      .menu(store)
      .then(({ data }) => {
        const menuData = (data && data.menu) || data
        setMenu(menuData)
        setActiveKey(Object.keys(menuData).shift() || '')
      })
      .catch(error => {
        notify({
          type: 'error',
          message: getApiErrorMessage(error)
        })
      })
  }

  useEffect(() => {
    // fetch store on change slug
    if (slug) {
      fetchStore(slug)
    }

    return () => setStore({})
  }, [ slug ])

  useEffect(() => {
    // fetch store on change slug
    if (store._id) {
      fetchMenu()
    }

    return () => setMenu({})
  }, [ store ])

  useEffect(() => {
    window.activeKey = activeKey
    return () => {
      delete window.activeKey
    }
  }, [ activeKey ])

  useEffect(() => {
    window.programmingScroll = false
    window.addEventListener('scroll', scrollListener)
    return () => {
      delete window.programmingScroll
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  /**
   * Detect to fixed menu's side bar
   */
  const scrollListener = e => {
    const bounding = menuRef.current.getBoundingClientRect()
    if (bounding.top <= 64 && !sideBarRef.current.classList.contains('is-fixed')) {
      cartRef.current.classList.add('is-fixed')
      sideBarRef.current.classList.add('is-fixed')
    } else if (bounding.top > 64 && sideBarRef.current.classList.contains('is-fixed')) {
      cartRef.current.classList.remove('is-fixed')
      sideBarRef.current.classList.remove('is-fixed')
    }

    if (window.programmingScroll) {
      return e.preventDefault()
    }

    const elements = window
      .document
      .querySelectorAll('div[group]')
      .values()
    for (const e of elements) {
      if (e.getAttribute('group') !== window.activeKey) {
        const bound = e.getBoundingClientRect()
        if (bound.top >= 0 && bound.top <= 350) {
          const key = e.getAttribute('group')
          setActiveKey(key)
          break
        }
      }
    }
  }

  const scrollToGroup = key => {
    setActiveKey(key)
    const element = window.document.querySelector(`[group="${key}"]`)
    if (element) {
      window.programmingScroll = true
      window.scrollTo({
        top: element.offsetTop - element.clientHeight - 64,
        behavior: 'smooth'
      })

      if (window.scrollTimeOut) {
        clearTimeout(window.scrollTimeOut)
      }

      window.scrollTimeOut = setTimeout(() => {
        window.programmingScroll = false
      }, 1000)
    }
  }

  /**
   * Render method
   */
  const renderGroup = () => {
    return Object
      .keys(menu)
      .map(key => (
        <div key={key} className="oneline-text group-item">
          <span onClick={() => scrollToGroup(key)} className={[ 'uppercase pointer', activeKey === key ? 'active' : '' ].join(' ')}>
            {menu[key].group}
          </span>
        </div>
      ))
  }

  const renderDishes = () => {
    return Object.keys(menu).map(key => (
      <React.Fragment key={key}>
        <div key={key} group={key} className="menu-group">
          <div className="uppercase">{menu[key].group}</div>
        </div>
        {menu[key].dishes.map((dish, index) => (
          <div key={`${key}-${index}`} className="dish-item">
            <div className="dish-img">
              <Image
                width="60"
                height="60"
                src={
                  (Array.isArray(dish.photos) && dish.photos.length
                    ? dish.photos[dish.photos.length - 1]
                    : {}).value
                }
              />
            </div>

            <div className="dish-info">
              <div className="font-bold">{dish.name}</div>
              <div>{dish.description}</div>
            </div>

            <div className="dish-price">
              {dish.discountPrice
                ? (
                  <>
                    <div className="oneline-text old-price">{vndCurrency(dish.price)}</div>
                    <div className="oneline-text">{vndCurrency(dish.discountPrice)}</div>
                  </>
                )
                : (
                  <div className="oneline-text">{vndCurrency(dish.price)}</div>
                )}
            </div>
            {/* {JSON.stringify(dish)} */}
          </div>
        ))}
      </React.Fragment>
    ))
  }

  const reviewURL = href => {
    if (store.provider === 'now' && store.url) {
      return (
        <div className="breadcrumb">
          <span className="breadcrumb-link pointer" onClick={() => toURL(store.url.replace('https://www.now.vn', 'https://foody.vn'))}>
            Xem thêm lượt đánh giá từ Foody
          </span>
        </div>
      )
    }
    return ''
  }

  return (
    <Box className="store-detail">
      <Grid className="container" container>
        <Grid className="banner" item xs={12} md={5}>
          <Image
            width="100%"
            height="100%"
            src={ensureObject(store.banner).value}
          />
        </Grid>

        <Grid className="information" item xs={12} md={7}>
          <div className="breadcrumb">
            <span className="breadcrumb-link pointer" onClick={() => toURL(store.url)}>{store.name}</span>
          </div>
          <div className="kind-restaurant">{ensureArray(store.categories).map(category => category.name).join()}</div>
          <div className="name-restaurant">{store.name}</div>
          <div className="address-restaurant">{store.address}</div>
          <Rating {...ensureObject(store.rating)} provider={store.provider}>
            {reviewURL()}
          </Rating>
        </Grid>

        {/* Menu & Cart */}
        <Grid className="menu-text" item xs={12}>Menu</Grid>

        <Grid container item xs={12}>
          <Grid className="fixed-container" item xs={12} md={3}>
            <div ref={sideBarRef} className="side-bar">
              {renderGroup()}
            </div>
          </Grid>

          <Grid ref={menuRef} className="menu-content" item xs={12} md={6}>
            {renderDishes()}
          </Grid>

          <Hidden smDown>
            <Grid className="fixed-container" item xs={12} md={3}>
              <div ref={cartRef} className="cart-content">
                <Cart/>
              </div>
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StoreDetail
