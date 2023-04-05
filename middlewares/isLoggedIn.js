const isLoggedIn = (req,res,next) => {
    const {profileId,productId} = req.body;
    if(!profileId) return res.status(400).json({message:"Profile id was not provided!"});
    next();
}

module.exports = isLoggedIn;