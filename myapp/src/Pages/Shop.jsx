import React from 'react'
import Hero from '../Components/Hero/Hero.jsx'
import Populars from '../Components/Popular/Populars.jsx'
import Offers from '../Components/Offers/Offers.jsx'
import NewCollections from '../Components/NewCollections/NewCollections.jsx'
import NewsLetter from '../Components/NewsLetter/NewsLetter.jsx'



const Shop = () => {
  return (
    <div>
      <Hero/>
      <Populars/>
      <Offers/>
      <NewCollections/>
      <NewsLetter/>
    </div>
  )
}

export default Shop
