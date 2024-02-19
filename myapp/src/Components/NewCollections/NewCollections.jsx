import React from 'react'
import {useEffect, useState } from 'react'
import'./NewCollections.css'
import Itemp from '../Item/Item.jsx'

const NewCollections = () => {
  const [new_collection,setNew_collection] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));

  },[])

   
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
          {new_collection.map((Item,i)=>{

             return <Itemp key={i} id={Item.id} name={Item.name} image={Item.image} new_price={Item.new_price} old_price={Item.old_price}/>
             
             })}
      </div>
    </div>
  )
}

export default NewCollections
