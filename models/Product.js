const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    type:{
        required:[true,'Type is required'],
        type: String
    },
    category:{
        required:[true,'Category is required'],
        type:String,
    },
    name:{
        required:[true,'Name is required'],
        type:String
    },
    gender:{
        required:[true, 'Gender is required'],
        type:String, 
    },
    brand:{
        required:[true,'Brand is required'],
        type:String,
    },
    imageUrl:{
        required:[true,'Image  is required'],
        type:String,
    },
    color:{
        required:[true,'Color is required'],
        type:String,
    },
    price:{
        required:[true,'Price is required'],
        type:Number,
    },
    sizes:{
        
    },
    onSale:{
        type:Boolean,
        default: false
    },
    salePercantage:{
        type:Number,
    },
    inStock:{
        type:Boolean,
        default:true
    }
})


const Product = mongoose.model("Product", productsSchema);

module.exports = Product;