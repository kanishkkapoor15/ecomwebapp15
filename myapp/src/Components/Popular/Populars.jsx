import React, { useEffect,useState } from 'react'
import './Popular.css'
import Itemp from '../Item/Item.jsx'

const Populars = () => {

const [popularProducts,setPopularProducts]= useState([]);

useEffect(()=>{
fetch('http://localhost:4000/popularinwomen')
.then((response)=>response.json())
.then((data)=>setPopularProducts(data));
},[])

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className="popular-item">
        {popularProducts.map((Item,i)=>{
            return <Itemp key={i} id={Item.id} name={Item.name} image={Item.image} new_price={Item.new_price} old_price={Item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Populars
