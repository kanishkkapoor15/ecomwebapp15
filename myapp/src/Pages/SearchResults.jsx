import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './CSS/SearchResults.css';


const SearchResults = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const value = params.get('value');

  // const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

 

  // useEffect(()=> {
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await axios.get(`http://localhost:4000/search?q=${searchQuery}`);
  //     setSearchResults(response.data);
  //   } catch (error) {
  //     setError('An error occurred while fetching search results.');
  //     console.error('Error searching for products:', error);
  //   }

  //   setLoading(false);
  // };

  useEffect(()=>{

    // setLoading(true);
    // setError('');
    //   const response = await axios.get(`http://localhost:4000/search?q=${searchQuery}`);
    //   const data = await response.json();

    //   setSearchResults(data);
    fetch(`http://localhost:4000/search?q=${value}`)
    .then((response)=>response.json())
    .then((data)=>setSearchResults(data));
    
 
});

  return (
 

      <div className="search-title">
        <h1>TOP RESULTS</h1>
        <hr />            
       <div className='search-results'> 
       
        {searchResults.map(product => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <Link to={`/product/${product.id}`}> <img src={product.image} alt="" /></Link>
            <p>Category: {product.category}</p>
            <div className="search-results-price">

             <div className='search-results-price-old'>           
              <p>Old Price:${product.old_price}</p>
             </div>
             <div className='search-results-price-new'>   
              <p>New Price: ${product.new_price}</p>
             </div>

            </div>

          </div>
        ))}
      </div>
      </div>
    

  
  )
}

export default SearchResults
