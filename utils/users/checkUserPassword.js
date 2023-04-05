const bcrypt = require("bcrypt");

const checkUserPassword = async(submitedPassword,userPassword) => {
    const isValid = await bcrypt.compare(submitedPassword,userPassword);
    if(!isValid) throw {status:401, message:'Incorrect Email or Password'};
}

module.exports = checkUserPassword