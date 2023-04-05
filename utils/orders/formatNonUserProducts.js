const formatNonUserProducts = (products) => {
    return products.map((product) => {
        return {
            _id:product.product._id,
            size:product.size,
            quantity:product.quantity
        }
    })
}

module.exports = formatNonUserProducts;