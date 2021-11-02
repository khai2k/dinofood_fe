import React from 'react'
// import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import generate from '_route/generate'
import { getCredentialSelector } from '_store/selectors/auth'

import IconTopUp from '_static/img/icons/top-up.png'
import IconReceipt from '_static/img/icons/receipt.svg'
import IconTransfer from '_static/img/icons/transfer.png'
import ImgSponsor from '_static/img/sponsor.png'
import ImgTopDebtor from '_static/img/top-debtor.png'
import ImgTopSpender from '_static/img/top-spender.png'

const Home = props => {
  // const history = useHistory()
  const credentials = useSelector(getCredentialSelector)
  const functionsBlock = [
    {
      url: generate('paymentRequest.create'),
      title: 'Nạp/rút tiền',
      alt: 'top-up',
      src: IconTopUp
    },
    {
      url: generate('transfer.create'),
      title: 'Chuyển tiền',
      alt: 'transfer',
      src: IconTransfer
    },
    {
      url: generate('receipt.create'),
      title: 'Nhập hóa đơn',
      alt: 'receipt',
      src: IconReceipt
    }
  ]

  return (
    <div className="home-page">
      {credentials._id ? (
        functionsBlock.map(func => (
          <Link key={func.url} to={func.url} className="home-block-item">
            <img
              title={func.title}
              alt={func.alt}
              src={func.src}
            />
            <label>{func.title}</label>
          </Link>
        ))
      ) : (
        <>
          <img alt="sponsor" className="home-block-item" src={ImgSponsor}/>
          <img alt="top-debtor" className="home-block-item" src={ImgTopDebtor}/>
          <img alt="top-spender" className="home-block-item" src={ImgTopSpender}/>
        </>
      )}
    </div>
  )
}

export default Home
