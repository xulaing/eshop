//let cart = null;
/*module.exports = class Cart {
    static save(product){
        if (cart){
            const existingIndex = cart.products.findIndex(p => p.id == product.id); // check existency of the product
            console.log(product.id);
            console.log(cart.products);
            if (existingIndex > 0){
                console.log('cart exists');
                const existingproduct = cart.products[existingIndex];
                existingproduct.qty += 1;
                cart.totalPrice += existingproduct.price;
            }else{
                console.log('cart doesnt exist');
                product.qty = 1;
                cart.products.push(product);
                cart.totalPrice += product.price;
            }
        }
        else{
            console.log('cart doesnt exist 2');
            cart = { products : [], totalPrice: 0};
            product.qty = 1;
            cart.products.push(product);
            cart.totalPrice += product.price;
        }
    }

    static getCart(){
        return cart;
    }
};*/

module.exports = function Cart(oldCart){
    this.items =  {};
    this.totalQty =   0; 
    this.totalPrice =  0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.price * storedItem.qty ;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.getCart = function(){
        return cart;
    }
};