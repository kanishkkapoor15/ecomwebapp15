import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image2.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
          <h1>Exclusive</h1>
          <h1>Offers for You</h1>
          <p>ONLY ON BEST SELLERS PRODUCTS</p>
          <button>Visit Now</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />
        </div>
      
    </div>
  )
}

export default Offers
