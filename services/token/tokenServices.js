const Token = require("../../models/Token");
const generateAccessToken = require("../../utils/tokens/generateAccessToken");

const create = async(user) => {
    let generatedToken = '';

    if(user.isAdmin) generatedToken = generateAccessToken.admin(user);
    if(!user.isAdmin) generatedToken = generateAccessToken.user(user);
    
    const token = await Token.create({profileId:user._id,token:generatedToken});
    return token;
}

const findByUserId = async(id) => {
    const foundToken = await Token.findOne({profileId : id});
    if(!foundToken) throw {status:404,message:"There is no token generated for this user!"}
    return foundToken;
}

const deleteByUserId = async(id) => {
    await Token.deleteOne({profileId : id})
}

const tokenServices = {
    create,
    findByUserId,
    deleteByUserId
}

module.exports = tokenServices;