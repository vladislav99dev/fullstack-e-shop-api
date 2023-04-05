const User = require("../../models/User");

    const create = async(data) => {
        const user = await User.create({...data})
        return user;
    }

    const findByEmail = async(email) => {
        const user = await User.findOne({email:email}).lean()
        return user;
    }

    const findById = async(id) => {
        const user = await User.findById(id)
        if(!user) throw {status:404,message:"User with this id was not found!"}
        return user;
    }

    const findByIdAndUpdate = async(id,data) => {
        const user = await User.findByIdAndUpdate(id,data,{returnDocument:'after'});
        return user;
    }

    const findByIdAndPopulate = async(id) => {
        const user = await User.findById(id).populate({
            path:'cart',
            populate:{
                path:'_id',
                model:'Product'
            }
        }).populate('favourites').lean();
        return user
    }


    const findByIdAndUpdatePassword = async(id,data) => {
        const user = await User.updateOne({_id:id},data,{returnDocument:'after'});
        return user; 
    }



const userServices = {
    create,
    findByEmail,
    findById,
    findByIdAndPopulate,
    findByIdAndUpdate,
    findByIdAndUpdatePassword
}


module.exports = userServices;