const verifyAccessToken = require('../utils/tokens/verifyAccessToken');
const tokenServices = require("../services/token/tokenServices");
const userServices = require("../services/user/userServices");

const isAdmin = async(req, res, next) => {
    const token = req.headers.authorization;
    const {profileId} = req.body;
    if(!token) return res.status(401).json({isAdmin:false, message: 'Access token is not provided!'});
    
    try{
        const user = await userServices.findById(profileId);

        const tokenDocument = await tokenServices.findByUserId(profileId);


        if(tokenDocument.token !== token) throw {status:400,message:"Invalid accessToken!"};
        
        const isVerified = await verifyAccessToken(user,token);

        if(!isVerified) {
            await tokenServices.deleteByUserId(profileId);
            return res.status(401).json({message:"Access Token expired please re-login"});
        }

    } catch(err){
        if(err.path === '_id' || err.path === 'profileId') return res.status(400).json({message:'Profile id is invalid!'});
        if(err.status) return res.status(err.status).json({message:err.message});
    }
    next()
}

module.exports = isAdmin