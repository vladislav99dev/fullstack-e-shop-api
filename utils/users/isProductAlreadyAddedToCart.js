const isProductAlreadyAddedToCart = (user,productId,size) => {
    for (const cartProduct of user.cart) {
        if(String(cartProduct._id).includes(productId) && cartProduct.size === size){
            return true
        }
    }
    return false;
}

module.exports = isProductAlreadyAddedToCart;