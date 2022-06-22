/****************Handle articles ******************/
const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');
const product = require("../models/product");
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var session = require("express-session");
var mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl : 'mongodb://localhost:27017/shopping' }),
    cookie: { maxAge: 180 * 60 * 1000}, 
  })
);


/* The shop showing all the articles */ 
router.get('/', function(req, res, next) {
  Product.find(function(err, products){ 
    console.log("getting the articles from shopping database");
    res.render('./shop/shopping', {title:'Shopping', products: products});
    console.log(product);
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  console.log("inside add to cart");
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product){
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart + "added to cart");
    res.redirect('/cart');
  });
});


module.exports = router
/************************************************ */

