/****************Handle articles ******************/
const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');
const product = require("../models/product");
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

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
	var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(req.session.cart);

  Product.findById(productId, function(err, product) {
    if (err){
      return res.redirect('/');
    }
    else{
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
    }
   
  })
});




module.exports = router
/************************************************ */

