/****************Handle articles ******************/
const express = require("express");
var mongoose = require('mongoose');
const app = express();
var path = require('path');

var router = express.Router();
var Product = require('../models/product');
/* Home */ 
// Mongoose connects Express to MongoDB
mongoose.connect('mongodb://localhost/shopping');

router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
      var productChunks = [];
      var chunkSize = 3;
      for (var i=0; i<docs.length;i++){
          productChunks.push(docs.slice(i, i+chunkSize));
      }
      res.render('./shop/shopping', {products: docs});
  })
});
module.exports = router
/************************************************ */
