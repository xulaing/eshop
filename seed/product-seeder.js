var Product = require('../models/product');
var path = require('path');
const { exit } = require('process');
// Mongoose connects Express to MongoDB
mongoose.connect('localhost:27017/shopping');

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
var done = 0;
for (var i=0; i <products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exit();
        }
    })
};

function exit(){
    mongoose.disconnect();
}
