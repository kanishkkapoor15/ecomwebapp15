import React, { useContext, useState } from 'react'
import './navbar.css'
import logo from '../Assets/blogo2.png'
import cart_icon from '../Assets/cart2.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import { useRef } from 'react'
import nav_dropdown_icon from '../Assets/nav-dropdown.png'
import brand_logo from '../Assets/brandLogo.png'



const Navbar = () => {
  const[menu,setMenu] = useState("shop");
  const {getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) =>{
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='Navbar'>
     <div className="nav-logo">
        <img className="nav-brand-logo"src={logo} alt="" />
        <img className="nav-brand-name" src={brand_logo} alt="" />
     </div>

     <div className='nav-dropdown'>
     <img onClick={dropdown_toggle} src={nav_dropdown_icon} alt="" />
     </div>

      <ul ref={menuRef} className="nav-menu">
      <li onClick={() =>setMenu("shop")}><Link style={{textDecoration:'none'}} to={'/'}>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
      <li onClick={() =>setMenu("men")}><Link style={{textDecoration:'none'}} to={'/men'}>Men</Link>{menu==="men"?<hr/>:<></>}</li>
      <li onClick={() =>setMenu("women")}><Link style={{textDecoration:'none'}} to={'/women'}>Women</Link>{menu==="women"?<hr/>:<></>}</li>
      <li onClick={() =>setMenu("kids")}><Link style={{textDecoration:'none'}} to={'kids'}>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to={'/login'}><button>Sign In</button></Link>
        <Link to={'/cart'}><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>

    </div>
  )
}

export default Navbar
