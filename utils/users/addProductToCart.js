const addProductToCart = (user,productId,size,quantity) => {
    user.cart.push({size:size,quantity:quantity,_id:productId})
    return user;
}
module.exports = addProductToCart;