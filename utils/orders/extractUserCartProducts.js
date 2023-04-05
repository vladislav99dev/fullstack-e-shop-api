const extractUserCartProducts = (user) => {
    const productsWanted = [...user.cart];
    user.cart = [];
    const modifiedUser = Object.assign({},user);
    return {productsWanted,modifiedUser}
}
module.exports = extractUserCartProducts;