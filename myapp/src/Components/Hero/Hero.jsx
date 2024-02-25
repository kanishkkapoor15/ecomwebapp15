import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/newArrival.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from  '../Assets/hero_image2.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>New Arrivals Only</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>New</p>
                    <img src={hand_icon} alt="" />
                </div>
                <p>Collections</p>
                <p>for you!</p>
            </div>
           <div className="hero-latest-btn" >
            <Link to='/SearchResults?value=men'><div className='hero-latest-btn-text'>Latest Collection</div></Link>
            <img src={arrow_icon} alt="" />
            </div> 
        </div>
        <div className="hero-right">
             <img src={hero_image} alt="" />
        </div>
      
    </div>
  )
}

export default Hero
