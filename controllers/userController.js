const router = require("express").Router();

const userDataValidation = require("../validations/userDataValidation");

const userProductsController = require("./userProductsController");

const userServices = require("../services/user/userServices");
const tokenServices = require("../services/token/tokenServices");

const checkUserPassword = require("../utils/users/checkUserPassword");
const verifyAccessToken = require("../utils/tokens/verifyAccessToken");

const registerHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const data = req.body;

  try {
    userDataValidation.validateRegisterData(data);

    const user = await userServices.findByEmail(data.email);
    if (user)
      throw { status: 409, message: "User with this email already exists!" };

    await userServices.create(data);

    return res
      .status(201)
      .json({ message: "You successfully created new user profile!" });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const editHandler = async (req, res) => {
  console.log(`PUT ${req.originalUrl}`);

  const { profileId } = req.params;
  const data = req.body;

  try {
    const user = await userServices.findById(profileId);

    const { token } = await tokenServices.findByUserId(profileId);

    const isVerified = await verifyAccessToken(user, token);
    if (!isVerified) {
      await tokenServices.deleteByUserId(user._id);
      throw {
        status: 401,
        message: "Access token expired,you should re-login!",
      };
    }

    userDataValidation.validateEditData(data);

    await userServices.findByIdAndUpdate(user._id, data);

    const populatedUser = await userServices.findByIdAndPopulate(profileId);

    delete populatedUser.password;

    return res.status(200).json({
      message: "You successfully updated your profile!",
      user: populatedUser,
    });
  } catch (err) {
    if (err.path === "_id" || err.path === "profileId")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const loginHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const data = req.body;

  try {
    userDataValidation.validateLoginData(data);

    const user = await userServices.findByEmail(data.email);
    if (!user) throw { status: 404, message: "Incorect Email or Password" };

    await checkUserPassword(data.password, user.password);

    const tokenDocument = await tokenServices.create(user);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    if (user.isAdmin)
      return res
        .status(200)
        .json({ user: { ...populatedUser, accessToken: tokenDocument.token } });
    if (!user.isAdmin)
      return res.status(200).json({
        user: populatedUser,
        message: "You have successfully logged in!",
      });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const changePasswordHandler = async (req, res) => {
  console.log(`PUT ${req.originalUrl}`);

  const { profileId } = req.params;
  const { oldPassword, newPassword, repeatNewPassword } = req.body;

  if (newPassword !== repeatNewPassword)
    return res.status(400).json({ message: "Passwords does not match!" });

  try {
    const user = await userServices.findById(profileId);

    const { token } = await tokenServices.findByUserId(user._id);

    const isVerified = await verifyAccessToken(user, token);
    if (!isVerified) {
      await tokenServices.deleteByUserId(user._id);
      throw {
        status: 401,
        message: "Access token expired,you should re-login!",
      };
    }

    await checkUserPassword(oldPassword, user.password);

    user.password = newPassword;

    await userServices.findByIdAndUpdatePassword(user._id, user);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    return res.status(200).json({
      user: {...populatedUser,accessToken:token},
      message: "You successfully updated your password!",
    });
  } catch (err) {
    if (err.path === "_id" || err.path === "profileId")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const logoutHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const { profileId } = req.params;

  try {
    const user = await userServices.findById(profileId);

    await tokenServices.deleteByUserId(user._id);

    return res
      .status(200)
      .json({ successMessage: "You have successfully loged out!" });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    console.log(err);
  }
};

const getCurrentUserData = async (req, res) => {
  console.log(`GET ${req.originalUrl}`);

  const { profileId } = req.params;

  try {
    const user = await userServices.findByIdAndPopulate(profileId);
    const tokenDocument = await tokenServices.findByUserId(profileId);
    delete user.password;

    return res.status(200).json({ ...user, accessToken: tokenDocument.token });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    console.log(err);
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/:profileId/logout", logoutHandler);
router.put("/:profileId/change-password", changePasswordHandler);
router.put("/:profileId/edit", editHandler);
router.get("/:profileId", getCurrentUserData);
router.use("/products", userProductsController);

module.exports = router;
