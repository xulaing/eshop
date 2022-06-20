const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');
const product = require("../models/product");
var router = express.Router();
var Product = require('../models/product');
/* The shop showing all the articles */ 
router.get('/', function(req, res, next) {
  Product.find(function(err, products){ 
    console.log("getting the articles from shopping database");
    res.render('./user/cart', {title:'Shopping cart', products: products});
  });
});
module.exports = router
