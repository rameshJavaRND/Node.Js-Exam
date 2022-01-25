require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

const app = express();
const port = process.env.PORT || 4000;

// static user details
const userData = {
  userId: "789789",
  username: "cluemediator",
  password: "123456",
  name: "Clue Mediator",
  isAdmin: true
};
let productData = [];
let productID = 1;

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});


// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});


// validate the user credentials
app.post('/api/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  // return 401 status if the credential is not match.
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong."
    });
  }

  // generate token
  const token = utils.generateToken(userData);
  // get basic user details
  const userObj = utils.getCleanUser(userData);
  // return the token along with user details
  return res.json({ user: userObj, token });
});


app.post('/api/signup', function (req, res) {
  const name = req.body.name;
  const pwd = req.body.password;
  const user = req.body.username;
  const email = req.body.email;
  const contact = req.body.contact;
  let userObj = {};

  // return 400 status if username/password is not exist
  if (!name || !pwd || !user || !email || !contact) {
    return res.status(400).json({
      error: true,
      message: "Required field is missing."
    });
  } else {
    userObj.name = name;
    userObj.username = user;
    userObj.email = email;
    userObj.contact = contact;
    return res.json({ user: userObj });
  }
});

app.post('/api/productManagement/saveProduct', function (req, res) {
  const productName = req.body.productName;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const vendor = req.body.vendor;
  const warranty= req.body.warranty;
  let productObj = {};

  // return 400 status if any data does  not exist
  if (!productName || !price || !quantity || !vendor || !warranty ) {
    return res.status(400).json({
      error: true,
      message: "Required field is missing."
    });
  } else {        // return response with the product data
    productObj.productId = productID;
    productObj.productName = productName;
    productObj.price = price;
    productObj.quantity = quantity;
    productObj.vendor = vendor;
    productObj.warranty = warranty;
    productData.push(productObj);
    productID++;

    return res.json({ product: productObj });
  }
});

// use get method to list out the products
app.get('/api/productManagement/listProduct', function (req, res) {

  return res.json({ product: productData });
});

//use patch to update the product details
app.patch('/api/productManagement/updateProduct', function (req, res) {
  const productId = req.body.productId;
  const productName = req.body.productName;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const vendor = req.body.vendor;
  const warranty= req.body.warranty;

  // return 400 status if any data does  not exist
  if (!productId ) {
    return res.status(400).json({
      error: true,
      message: "Required field is missing."
    });
  } else {        // return response with the product data
    let productIndex = productData.findIndex(product => (product.productId === productId));
    productData[productIndex].productName = productName;
    productData[productIndex].price = price;
    productData[productIndex].quantity = quantity;
    productData[productIndex].vendor = vendor;
    productData[productIndex].warranty = warranty;

    return res.json({ product: productData });
  }
});

//Delete a product detail
app.delete('/api/productManagement/deleteProduct', function (req, res) {
  const productId = req.body.productId;

  // return 400 status if any data does  not exist
  if (!productId ) {
    return res.status(400).json({
      error: true,
      message: "Required field is missing."
    });
  } else {        // return response with the product data
    let productIndex = productData.findIndex(product => (product.productId === productId));
    productData.splice(productIndex,1)
    return res.json({ Message:"product deleted" });
  }
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
