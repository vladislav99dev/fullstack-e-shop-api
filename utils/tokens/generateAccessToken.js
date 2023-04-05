const jwt = require("jsonwebtoken");

const admin = (user) => {
  return jwt.sign(user, process.env.ADMIN_ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const user = (user) => {
  return jwt.sign(user, process.env.USER_ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const generateAccessToken = {
  admin,
  user,
};

module.exports = generateAccessToken;
