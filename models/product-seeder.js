var Product = require('../models/product');
var path = require('path');
// Mongoose connects Express to MongoDB
var mongoose = require('mongoose');
var products = [
    new Product({
        imagePath: 'https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/SI_Hub_Zelda_Portal_image1280w.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50,
      //  qty:1
    }),
    new Product({
        imagePath: 'https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/SI_Hub_Zelda_Portal_image1280w.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50,
       // qty:1
    }),
    new Product({
        imagePath: 'https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/SI_Hub_Zelda_Portal_image1280w.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50,
      //  qty:1
    }),
    new Product({
        imagePath: 'https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/SI_Hub_Zelda_Portal_image1280w.jpg',
        title: 'Zelda',
        description: 'Awesome Game !!!',
        price: 50,
      //  qty:1
    })
];


(async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/shopping'); // Database will be created automatically into mongodb
        console.log("connexion réussie avec la bdd shopping");
        var done = 0;
        for (var i = 0; i < products.length; i++){
            products[i].save(function(err, result){
                done++;
                if (done === products.length){
                    exit();
                }
            });
        }
        console.log("sauvegarde dans la bdd shopping réussie")
    }
    catch{
        console.log("erreur");
    }
})();


function exit(){
    mongoose.disconnect();
}

