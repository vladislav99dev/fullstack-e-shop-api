const removeProductFromCart = (user,productId,size) => {
    for (const product of user.cart) {

        if(String(product._id).includes(productId) && product.size === size) {
            const indexOfFoundProduct = user.cart.indexOf(product);
            user.cart.splice(indexOfFoundProduct,1);
            return user;
        }

    }
    throw {status:404,message:"There is no product with this id in user cart!"}
}

module.exports = removeProductFromCart;