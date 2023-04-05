const isSizeValid = (product,size) => {
    if(!product.sizes.hasOwnProperty(size)) throw {status:400, message:'You have entered invalid size!'}
}

module.exports = isSizeValid;