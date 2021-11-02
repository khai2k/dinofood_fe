import React, { useEffect } from 'react'
// import { useHistory, useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import { CART } from '_constants/'
// import useQueryParam from '_hooks/useQueryParam'
import { vndCurrency } from '_utils/helpers'
// import { firestore } from '_firebase'
import { getCartSelector } from '_store/selectors/cart'
import { getCredentialSelector } from '_store/selectors/auth'

const Cart = props => {
  const dispatch = useDispatch()
  // const history = useHistory()
  // const params = useParams()
  // const queryParams = useQueryParam()
  // const { order } = queryParams.order ? queryParams : params

  const credentials = useSelector(getCredentialSelector)
  const cart = useSelector(getCartSelector)

  useEffect(() => {
    // if (order) {
    //   /**
    //    * Watch orders record
    //    */
    //   const unsubscribeOrderRef = firestore
    //     .collection('orders')
    //     .doc(order)
    //     .onSnapshot(doc => {
    //       dispatch({ type: CART, payload: doc.data() })
    //     }, error => {
    //       console.log('orders', { error })
    //     })

    //   // Stop listening to changes
    //   return () => {
    //     unsubscribeOrderRef()
    //     dispatch({ type: CART, payload: {} })
    //   }
    // }

    dispatch({ type: CART, payload: { author: credentials } })

    return () => {
      dispatch({ type: CART, payload: {} })
    }
  }, [])

  useEffect(() => {
    if (!cart._id && credentials._id) {
      dispatch({ type: CART, payload: { author: credentials } })
    }
  }, [ credentials ])

  const renderCartMembers = () => {
    return (<div>renderCartMembers</div>)
  }

  return (
    <div className="cart-info">
      <div className="cart-header noselect">
        <button className="cart-stats">
          <span className="bold">{cart.countDish || 0}</span>
          &nbsp;phần&nbsp;-&nbsp;
          <span className="bold">{cart.countMember || 0}</span>
          &nbsp;người
        </button>

        <span className="btn-group">
          <div className="btn-order-group">Đặt theo nhóm</div>
          <button className="btn-reset">Xóa</button>
        </span>

        <div className="create-order">
          Đơn hàng tạo bởi
          <span className="txt-blue">{cart.author && cart.author.name}</span>
        </div>
      </div>

      {renderCartMembers()}

      <div className="bill-info">
        <span>Tổng cộng</span>
        <span className="txt-blue bold right">
          {vndCurrency(cart.subTotal || 0)}
        </span>
      </div>

      <button className="btn-red pointer">
        <i className="fas fa-check-circle" /> Đặt trước
      </button>
    </div>
  )
}

export default Cart
