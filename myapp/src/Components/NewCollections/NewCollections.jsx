import React from 'react'
import'./NewCollections.css'
import new_collection from '../Assets/new_collections'
import Itemp from '../Item/Item.jsx'

const NewCollections = () => {
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
