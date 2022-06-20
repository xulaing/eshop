var Product = require('../models/product');
var path = require('path');
//const { exit } = require('process');
// Mongoose connects Express to MongoDB
var mongoose = require('mongoose');
var products = [
    new Product({
    imagePath: 'zelda.jpg',
    title: 'Zelda',
    description: 'Awesome Game !!!',
    price: 50
    }),
    new Product({
        imagePath: 'zelda.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50
    }),
    new Product({
        imagePath: 'zelda.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50
    }),
    new Product({
        imagePath: 'zelda.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50
    })
];


(async ()=>{
    (async () =>{
      try{
        await mongoose.connect('mongodb://localhost:27017/shopping'); // Database will be created automatically into mongodb
        console.log("connexion réussie avec la bdd shopping");
        const article = new Product(
            {
                imagePath: 'zelda.jpg',
                title: 'Zelda',
                description: 'Awesome Game !!!',
                price: 50
            }
        );
        var result = await article.save();
        console.log(result);
      }
      catch{
        console.log("erreur");
      }
    })();
})

/**var done = 0;
        for (var i = 0; i < products.length; i++){
            products[i].save(function(err, result){
                done++;
                if (done === products.length){
                    exit();
                }
            });
        } */


function exit(){
    mongoose.disconnect();
}

