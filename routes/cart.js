const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');
const product = require("../models/product");
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require('../models/cart');

/* The shopping-cart of the user  */ 
router.get('/', function(req, res, next) {
  if (!req.session.cart){
    res.render('./shop/shopping-cart'), {products: null};
  }else{
    var cart = new Cart(req.session.cart);
    res.render('./shop/shopping-cart'), {products: cart.generateArray(), totalPrice: cart.totalPrice};
  }
});


module.exports = router










