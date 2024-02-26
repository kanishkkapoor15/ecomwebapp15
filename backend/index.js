const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");

app.use(express.json());
app.use(cors());

//Database connection with MongoDB
mongoose.connect("mongodb+srv://kanishkkapoor15:987654321@cluster0.knqbwwa.mongodb.net/ecomwebapp15")

//API CREATION
app.get("/",(req,res)=>{
     res.send("Express app is Running")
})

// IMAGE STORAGE ENGINE

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
    ratings: {
        type: Number,
        default: 0,
      },
      stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
       
      },
    
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        stock:req.body.stock,
    });
    console.log(product);
    await product.save();
    console.log("Product Saved");

    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for deleting products
app.post('/removeproduct',async(req,res)=>{

    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name: req.body.name
    })
})

//Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema Creating for user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
        
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
      },
      cartData:{
        type:Object,
      },
      date:{
        type:Date,
        default:Date.now,
      }
    
})

// Creating Endpoint for registering the user

app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"Existing User Found registered with this email"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;        
    }
    const user = new Users({
        name: req.body.username ,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})


})


// Creating end point for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id: user.id
                }

            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Wrong Email Address"})
    }
})

//Creating end point for new collections data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    //it fetches latest added products(last 8 added products)
    console.log("New Collections Fetched");
    res.send(newcollection);

})

//#creating endpoint for popular in women section

app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch user
const fetchUser = async(req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom')
            req.user = data.user;
            next();
            
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using a valid token"});
        }
    }

}

//creating end point to store cart data in backend
app.post('/addtocart',fetchUser , async(req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    //complete user object's data will be stored in userData
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    //it will find the user with the id and then update the cart data object with the userData
    res.send("Updated user and the cart")
}) 

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    //complete user object's data will be stored in userData
    if(userData.cartData[req.body.itemId] >0)
    userData.cartData[req.body.itemId] -= 1;
   
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    //it will find the user with the id and then delete the cart data object with the userData
    res.send("removed from the cart")
}) 




//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");

    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);

})

// creating product search endpoint
app.get('/search', async (req, res) => {
    try {
      const query = req.query.q;
      const products = await Product.find({ name: { $regex: query, $options: 'i' } });
      res.json(products);
    } catch (error) {
      console.error('Error searching for products:', error);
      res.status(500).json({ error: 'An error occurred while searching for products.' });
    }
  });



// Endpoint to allow users to post product reviews
app.post('/api/products/:productId/reviews', fetchUser, async (req, res) => {
    try {
      const productId = req.params.productId;
      const { rating, comment } = req.body;
      
      // Get user information from JWT token
      const userId = req.user.id;
  
      // Fetch user details from Users model
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      // Create the review object
      const review = {
        user: userId,
        name: user.name, // Populate name from user details
        rating: Number(rating),
        comment,
      };
  
      // Find the product by ID and update its reviews array
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
      await product.save();
  
      res.status(201).json({ success: true, message: 'Review added successfully' });
      console.log("Review added Successfully");
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


  // Endpoint to fetch product reviews by product ID
app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.status(200).json({ success: true, reviews: product.reviews });
      console.log("Reviews Fetched Successfully!")
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });





// //Applying product schema changes to all the products present in the database
// async function migrateProducts() {
//      // Update existing products with new schema fields and default values
//      const result = await Product.updateMany(
//         {},
//         {
//           $set: {
//             ratings: 0,
//             stock: 1,
//             numOfReviews: 0,
//             reviews: [],
//             user: null
//           }
//         }
//       );
  
//       console.log(`${result.nModified} products updated successfully`);
// }
// migrateProducts(); 
  
  




app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port: "+port)
    }
    else{
        console.log("Error: "+error)
    }
})
