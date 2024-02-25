import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image2.png'
import { Link } from 'react-router-dom'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
          <h1>Exclusive</h1>
          <h1>Offers for You</h1>
          <p>ONLY ON BEST SELLERS PRODUCTS</p>
          <Link to='/SearchResults?value=top'><button>Visit Now</button></Link>
        </div>
        <div className="offers-right">
           <img src={exclusive_image} alt="" />
        </div>
      
    </div>
  )
}

export default Offers
