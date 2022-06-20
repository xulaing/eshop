var Product = require('../models/product');
var path = require('path');
// Mongoose connects Express to MongoDB
var mongoose = require('mongoose');

var products_added = [

]

(async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/shopping'); // Database will be created automatically into mongodb
        products_added.push(products[0]);
        console.log(products[0])
        products_added[0].save();
        console.log("ajout dans le panier réussi");
    }
    catch{
        console.log("erreur grrr");
    }
})();


function exit(){
    mongoose.disconnect();
}

