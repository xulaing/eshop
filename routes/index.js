/****************Handle articles ******************/
const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');

var router = express.Router();
var Product = require('../models/product');
/* Home */ 
router.get('/', function(req, res, next) {
  Product.find(function(err, product){
      // check for and handle query errors
      /*if (err) {
        console.error('Product.find() error', err);
        return next(err);
      }*/
      console.log(product);
      res.render('./shop/shopping', {title:'Shopping cart', products: product});
  });
});
module.exports = router
/************************************************ */
