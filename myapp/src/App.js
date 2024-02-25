import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import Shop from './Pages/Shop.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import Footer from './/Components/Footer/Footer.jsx';
import{BrowserRouter,Routes,Route} from 'react-router-dom';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import SearchResults from './Pages/SearchResults.jsx';
import SearchBar from './Components/SearchBar/SearchBar.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/men' element={<ShopCategory banner= {men_banner} category= "men"/>}/>
        <Route path='/women' element={<ShopCategory banner = {women_banner} category= "women"/>}/>
        <Route path='/kids' element={<ShopCategory banner = {kid_banner} category= "kid"/>}/>
        <Route path="/product" element={<Product/>}>
           <Route path=':productId' element={<Product/>}/>
         </Route>  
         <Route path='/cart' element={<Cart/>}/>
         <Route path='/login' element={<LoginSignup/>}/>
         <Route exact path='/' Component={SearchBar}/>
         <Route path='/SearchResults'  Component={SearchResults}/>

         
      </Routes>
      <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
