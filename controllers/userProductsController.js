const router = require("express").Router();

const productsServices = require("../services/products/productsServices");
const userServices = require("../services/user/userServices");
const tokenServices = require("../services/token/tokenServices");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isProductAlreadyAddedToCart = require("../utils/users/isProductAlreadyAddedToCart");
const incrementCartProductQuantity = require("../utils/users/incrementCartProductQuantity.js");
const addProductToCart = require("../utils/users/addProductToCart");
const removeProductFromCart = require("../utils/users/removeProductFromCart");
const isSizeValid = require("../utils/users/addingToCartCheckIsSizeValid");

const addToCartHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const { profileId, size, quantity } = req.body;
  const { productId } = req.params;

  let modifiedUser = {};

  try {
    const user = await userServices.findById(profileId);

    const product = await productsServices.findById(productId);

    const tokenDocument = await tokenServices.findByUserId(user._id);

    isSizeValid(product, size);

    const isAlreadyAdded = isProductAlreadyAddedToCart(user, productId, size);
    if (isAlreadyAdded)
      modifiedUser = incrementCartProductQuantity(
        user,
        productId,
        size,
        quantity
      );
    if (!isAlreadyAdded)
      modifiedUser = addProductToCart(user, productId, size, quantity);

    await userServices.findByIdAndUpdate(user._id, modifiedUser);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    return res
      .status(200)
      .json({ ...populatedUser, accessToken: tokenDocument.token });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({
        message: "One or all of the id's you provided are not in valid format.",
      });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const removeFromCartHandler = async (req, res) => {
  console.log(`DELETE ${req.originalUrl}`);

  const { profileId, size } = req.body;
  const { productId } = req.params;

  try {
    const user = await userServices.findById(profileId);

    const product = await productsServices.findById(productId);

    const tokenDocument = await tokenServices.findByUserId(user._id);

    let modifiedUser = removeProductFromCart(user, productId, size);

    await userServices.findByIdAndUpdate(user._id, modifiedUser);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    return res
      .status(200)
      .json({ ...populatedUser, accessToken: tokenDocument.token });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({
        message: "One or all of the id's you provided are not in valid format.",
      });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const addToFavouritesHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const { profileId } = req.body;
  const { productId } = req.params;

  try {
    const user = await userServices.findById(profileId);

    const product = await productsServices.findById(productId);

    const tokenDocument = await tokenServices.findByUserId(user._id);

    if (user.favourites.includes(productId))
      throw {
        status: 409,
        message: `Product ${product.name} is already added to favourites!`,
      };
    user.favourites.push(productId);

    await userServices.findByIdAndUpdate(user._id, user);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    return res
      .status(200)
      .json({ ...populatedUser, accessToken: tokenDocument.token });
  } catch (err) {
    console.log(err);
    if (err.path === "_id")
      return res.status(400).json({
        message: "One or all of the id's you provided are not in valid format.",
      });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const removeFromFavouritesHandler = async (req, res) => {
  console.log(`DELETE ${req.originalUrl}`);

  const { profileId } = req.body;
  const { productId } = req.params;

  try {
    const user = await userServices.findById(profileId);

    const product = await productsServices.findById(productId);

    const tokenDocument = await tokenServices.findByUserId(user._id);

    if (!user.favourites.includes(productId))
      throw {
        status: 404,
        message: `Product ${product.name} is not found in profile favourites!`,
      };

    const indexOfProduct = user.favourites.indexOf(productId);
    user.favourites.splice(indexOfProduct, 1);

    await userServices.findByIdAndUpdate(user._id, user);

    const populatedUser = await userServices.findByIdAndPopulate(user._id);

    delete populatedUser.password;

    return res
      .status(200)
      .json({ ...populatedUser, accessToken: tokenDocument.token });
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({
        message: "One or all of the id's you provided are not in valid format.",
      });
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

router.post("/:productId/favourites-add", isLoggedIn, addToFavouritesHandler);
router.delete(
  "/:productId/favourites-remove",
  isLoggedIn,
  removeFromFavouritesHandler
);

router.post("/:productId/cart-add", isLoggedIn, addToCartHandler);
router.delete("/:productId/cart-remove", isLoggedIn, removeFromCartHandler);

module.exports = router;
