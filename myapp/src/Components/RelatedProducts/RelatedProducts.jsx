import React from 'react'
import './RelatedProducts.css'
import data_product from '../Assets/data'
import Itemp from '../Item/Item'

const RelatedProducts = () => {
  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
       {data_product.map((Item,i)=>{
         return<Itemp key={i} id={Item.id} name={Item.name} image={Item.image} new_price={Item.new_price} old_price={Item.old_price}/>
       })}
      </div>
    </div>

  )
}

export default RelatedProducts
