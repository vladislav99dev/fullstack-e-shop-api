const Product = require('../../models/Product')


 const create = async(data) => {
    const product = await Product.create({...data})
    return product;
}
const findById = async(id) => {
    const product = await Product.findById(id);
    if(!product) throw {status:404,message:'Product with this id was not found!'};
    return product
} 
const findByIdAndUpdate = async(id,data) => {
    const product = await  Product.findByIdAndUpdate(id,data);
    return product;
}

const deleteById = async(id) => {
    await Product.findByIdAndDelete(id)
}

const findAll = async() => {
    const products = await  Product.find();
    return products;
}

const findByGender = async(gender) => {
    const products =  Product.find({gender:gender}).exec()
    return products;
}

const findAndFilter = async(filterData) => {
    const products = await  Product.find({...filterData})
    return products;
}
const findSale = async() => {
    const products = await  Product.find({onSale:true})
    return products;
}

const productsServices = {
    create,
    findById,
    findByIdAndUpdate,
    deleteById,
    findByGender,
    findAll,
    findAndFilter,
    findSale
}
module.exports = productsServices;