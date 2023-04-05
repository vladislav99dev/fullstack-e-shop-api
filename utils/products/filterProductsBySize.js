const filterProductsBySize = (products,sizes) => {
    for (const product of products) {
        for (let i = 0; i < sizes.length; i++) {
            let currSize = sizes[i];
            if(product.sizes[currSize] > 0){
                break;
            }
            if(i  === sizes.length - 1){
                products = products.filter(x => x !== product)
            }
        }
    }
    return products
}
module.exports = filterProductsBySize;