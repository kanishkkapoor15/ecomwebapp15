const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');


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
    type:{
        type:String,
        default:"shirt"
    },
    color:{
        type:String,
        default:"black",
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
      },
      country_code:{
        type:String,
        default:"null",
      },
      phone:{
        type:String,
        default: "000000000000",
      },
      address1:{
        type:String,
        default:"null",
      },
      address2:{
        type:String,
        default:"null",
      },
      profile_image:{
        type:String,
        default:"null",
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
            id: user.id,
            name: user.name,
            email: user.email
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
                    id: user.id,
                    name: user.name,
                    email: user.email
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

//API to clear all items at once
app.post('/clear-cart', fetchUser, async (req, res) => {
  try {
    // Fetch the user data
    let userData = await Users.findOne({_id:req.user.id});
    while(userData.cartData[req.body.itemId] >0){

    
    userData.cartData[req.body.itemId] -= 1;
    }
    // Save the updated user data
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'An error occurred while clearing cart' });
  }
});




//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");

    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);

})

// Get products by name or type
// Backend code to handle multiple words in the search query
const querystring = require('querystring');

app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const words = query.split(',').map(word => word.trim()); // Split query string at commas and trim each word

    const searchResults = [];

    // Perform the search for each word in the query
    for (const word of words) {
      const products = await Product.find({
        $or: [
          { name: { $regex: word, $options: 'i' } },
          { type: { $regex: word, $options: 'i' } }
        ]
      });

      // Add unique products from the current search results to the overall search results
      products.forEach(product => {
        if (!searchResults.some(p => p._id.toString() === product._id.toString())) {
          searchResults.push(product);
        }
      });
    }

    // Check if "category" parameter is provided
    let category = req.query.category;
    // URL-decode the category value to remove '%27'
    if (category) {
      category = querystring.unescape(category);
    }

    // Filter the search results based on the category if provided
    const filteredResults = category ? searchResults.filter(product => product.category === category) : searchResults;

    res.json(filteredResults);
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


  // Handle image feature extraction here

  const featureStorage = multer.diskStorage({
    destination: './upload/features',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const featureUpload = multer({ storage: featureStorage });


// Load pre-trained MobileNet model
const mobilenet = require('@tensorflow-models/mobilenet');
let model;

async function loadModel() {
    try {
        model = await mobilenet.load();
        console.log('MobileNet model loaded');

        // Process products after the model is loaded
        // await processProducts();
    } catch (error) {
        console.error('Error loading MobileNet model:', error);
    }
}
// async function processProducts() {
//     try {
//         const products = await Product.find({});

//         // Process each product
//         for (const product of products) {
//             try {
//                 const image = await loadImage(product.image); // Load the image

//                 const canvas = createCanvas(image.width, image.height);
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(image, 0, 0, image.width, image.height);

//                 // Preprocess image and convert to Tensor
//                 const tensor = tf.browser.fromPixels(canvas)
//                     .resizeNearestNeighbor([224, 224]) // Resize image to match MobileNet input size
//                     .toFloat()
//                     .expandDims();

//                 // Extract features using MobileNet model
//                 const predictions = await model.classify(tensor);

//                  // Sort predictions by probability in descending order
//                  predictions.sort((a, b) => b.probability - a.probability);
//                  const classNames = predictions.map(prediction => prediction.className);
         
//                  // // Get the class name with the highest probability
//                  // const mostProbableClass = predictions[0].className;
//                  // Concatenate class names into a single string
//                  const mostProbableClass = classNames.join(', ');         

//                 product.type = mostProbableClass;
//                 console.log(`Type initialized for product ${product.name}: ${mostProbableClass}`);
//                 // Save the updated product back to the database
//                 await product.save();

//             } catch (error) {
//                 console.error('Error processing product:', error);
//             }
//         }

//         console.log('Type initialization process completed.');
//     } catch (error) {
//         console.error('Error retrieving products:', error);
//     }
// }

loadModel();

app.post("/extract-features", featureUpload.single('image'), async (req, res) =>  {
    try {
        const image = await loadImage(req.file.path);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Preprocess image and convert to Tensor
        const tensor = tf.browser.fromPixels(canvas)
            .resizeNearestNeighbor([224, 224]) // Resize image to match MobileNet input size
            .toFloat()
            .expandDims();

        // Extract features using MobileNet model
        const predictions = await model.classify(tensor);

        // Sort predictions by probability in descending order
        predictions.sort((a, b) => b.probability - a.probability);
        const classNames = predictions.map(prediction => prediction.className);

        // // Get the class name with the highest probability
        // const mostProbableClass = predictions[0].className;
        // Concatenate class names into a single string
        const mostProbableClass = classNames.join(', ');

        // Return the most probable class name as JSON response
        res.json({ className: mostProbableClass });

    } 
    catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
});








//Retrieve all products from the database to initialize product type using tensor flow CNN
// Product.find({})
// .then(async (products) => {
    
//     // Process each product
//     for (const product of products) {
//         try {
                  

//         const image = await loadImage(product.image);
//         console.log("Image Loaded");

//         const canvas = createCanvas(image.width, image.height);
//         console.log("Image processed in canvas",image.width,image.height);

//         const ctx = canvas.getContext('2d');
//         console.log("ctx");
//         ctx.drawImage(image, 0, 0, image.width, image.height);
//         console.log("ctx draw");


//         // Preprocess image and convert to Tensor
//         const tensor = tf.browser.fromPixels(canvas)
//             .resizeNearestNeighbor([224, 224]) // Resize image to match MobileNet input size
//             .toFloat()
//             .expandDims();
//             console.log("tensor");

//         // Extract features using MobileNet model
//         const predictions = await model.classify(tensor);
//         console.log("tensor classify");


//         // Sort predictions by probability in descending order
//         predictions.sort((a, b) => b.probability - a.probability);

//         // Get the class name with the highest probability
//         const mostProbableClass = predictions[0].className;
        
//         product.type = mostProbableClass;
//         console.log(`Type initialized for product ${product.name}: ${mostProbableClass}`);
//          // Save the updated product back to the database
//          await product.save();

//         } 
//         catch (error) {
//             console.error('Error processing product:', error);
//         }
//     }

//     console.log('Type initialization process completed.');
// })
// .catch((error) => {
//     console.error('Error retrieving products:', error);
// });




// //Applying user schema changes to all the products present in the database
// async function migrateUsers() {
//      // Update existing products with new schema fields and default values
//      const result = await Users.updateMany(
//         {},
//         {
//           $set: {
//           country_code:"null",
//           phone:"0000000000",
//           address1:"null",
//           address2:"null",
//           profile_image:"null",
          

//           }
//         }
//       );
  
//       console.log(`${result.nModified} users updated successfully`);
// }
// migrateUsers(); 
  
  
const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      
    },
    userEmail: {
      type: String,
      required: true
      
    },
    userName: {
        type: String,
        required: true
        
      },
    dateOfOrder: {
      type: Date,
      default: Date.now
    },
    modeOfPayment: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    cartData: {
      type: Object,
      required: true
    }
  });
  

  const Order = mongoose.model('Order', orderSchema);


  // POST endpoint for processing orders
// Endpoint to process orders
app.post('/process-order', fetchUser,async (req, res) => {
    try {
          // Ensure req.user contains necessary properties
          if (!req.user || !req.user.email || !req.user.name) {
            return res.status(400).json({ error: 'User information not found in the token.' });
        }

        let { userId,userEmail,userName,modeOfPayment, paymentStatus, totalAmount, cartData } = req.body;
         userId = req.user.id;
         userEmail = req.user.email;
         userName = req.user.name;


  
      // Create a new order document
      const newOrder = new Order({
        userId,
        userEmail,
        userName,
        modeOfPayment,
        paymentStatus,
        totalAmount,
        cartData
      });
  
      // Save the order to the database
      await newOrder.save();

      const updatedCartData = {};
      for (let i = 0; i < 300; i++) {
        updatedCartData[i] = 0;        
       }

      // Update the user's cartData with the updated cartData object
      await Users.findByIdAndUpdate(userId, { $set: { cartData: updatedCartData } });
      // Return a success message
      res.status(200).json({ message: 'Order processed successfully', orderId: newOrder._id });
    } catch (error) {
      // Return an error message if there's any issue processing the order
      console.error('Error processing order:', error);
      res.status(500).json({ error: 'An error occurred while processing the order' });
    }
  });

  // Define the route for fetching orders by user ID
app.get('/user/orders', fetchUser, async (req, res) => {
  try {
      // Ensure req.user contains necessary properties
      if (!req.user || !req.user.id) {
          return res.status(400).json({ error: 'User information not found in the token.' });
      }

      // Fetch orders by user ID
      const orders = await Order.find({ userId: req.user.id });

      res.status(200).json(orders);
  } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching user orders' });
  }
});


  //Update user details, MyAccount Page

  app.put('/user',fetchUser, async (req, res) => {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's ID
    const updateFields = req.body;

    try {
        // Check if the user exists
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user fields
        for (const [key, value] of Object.entries(updateFields)) {
            if (user[key] !== undefined) {
                user[key] = value;
            }
        }

        // Save the updated user
        await user.save();

        res.json({ message: 'User updated successfully', user: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating user' });
    }
});

// Route to get details of a single authenticated user
app.get('/user', fetchUser, async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user.id;

    // Find the user in the database using the ID
    const user = await Users.findById(userId);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ errors: 'User not found' });
    }

    // Construct the response with required user details
    const userDetails = {
        id: user.id,
        email: user.email,
        name: user.name,
        address1: user.address1,
        address2: user.address2,
        phone: user.phone,
        country_code: user.country_code,
        profile_image: user.profile_image
        // Add other fields as needed
    };

    // Send the response with user details
    res.json(userDetails);
} catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ errors: 'An error occurred while fetching user details' });
}
});


// Define storage for profile image uploads
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/profiles') // Destination folder for storing profile images
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) // Unique filename for each uploaded image
  }
});

// Initialize multer upload middleware for profile images
const profileUpload = multer({ storage: profileStorage });

// Define the route for uploading profile image
app.post('/user/profile-image', fetchUser, profileUpload.single('profileImage'), async (req, res) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's ID
  const profileImageUrl = req.file.path; // File path of the uploaded image

  try {
      // Check if the user exists
      const user = await Users.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update the profile image field
      user.profile_image = profileImageUrl;

      // Save the updated user
      await user.save();

      res.json({ message: 'Profile image uploaded successfully', profile_image: profileImageUrl });
  } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ error: 'An error occurred while uploading profile image' });
  }
});


// Define the route for updating profile image
app.put('/user/profile-image',fetchUser, profileUpload.single('profileImage'), async (req, res) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's ID
  const profileImageUrl = req.file.path; // File path of the uploaded image

  try {
      // Check if the user exists
      const user = await Users.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update the profile image field
      user.profile_image = profileImageUrl;

      // Save the updated user
      await user.save();

      res.json({ message: 'Profile image updated successfully', profile_image: profileImageUrl });
  } catch (error) {
      console.error('Error updating profile image:', error);
      res.status(500).json({ error: 'An error occurred while updating profile image' });
  }
});

  



app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port: "+port)
    }
    else{
        console.log("Error: "+error)
    }
})
