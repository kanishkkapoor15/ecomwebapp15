import React, { useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../Assets/searchIcon.png';


const SearchBar = () => {

    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate(`/SearchResults?value=${inputValue}`);
    };

  

  return  (
  <form onSubmit={handleSubmit} className="searchBar">
    <div className='searchBox'>
     
       <button type='submit'><img src={SearchIcon} alt="" /></button><input type="text" value={inputValue}  onChange={(e) => setInputValue(e.target.value)} placeholder="Search G&G"/>
      
      


    </div>
</form>


  );

}
export default SearchBar
