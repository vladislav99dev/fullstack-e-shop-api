const removeProductFromCart = require("./removeProductFromCart");

const incrementCartProductQuantity = (user,productId,size,quantity) => {
    for (const product of user.cart) {
        if(String(product._id).includes(productId) && product.size === size){
            const modifiedCartProduct = Object.assign({},{
                size:product.size,
                quantity:product.quantity + quantity,
                _id:product._id
            })
            const modifiedUser = removeProductFromCart(user,productId,size);
            modifiedUser.cart.push(modifiedCartProduct);
            return modifiedUser;
        }
    }
    
}

module.exports = incrementCartProductQuantity;