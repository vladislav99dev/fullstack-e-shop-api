const router = require("express").Router();

const userServices = require("../services/user/userServices");
const productServices = require("../services/products/productsServices");
const orderServices = require("../services/orders/orderServices");
const tokenServices = require("../services/token/tokenServices");

const orderDataValidation = require("../validations/orderDataValidation");

const formatNonUserProducts = require("../utils/orders/formatNonUserProducts");
const extractUserCartProducts = require("../utils/orders/extractUserCartProducts");

const createOrderHandler = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const data = req.body;

  try {
    orderDataValidation.validateOrderData(data);

    const isUserRequest = Boolean(data.profileId);

    if (isUserRequest) {
      const user = await userServices.findById(data.profileId);

        console.log(isUserRequest);

      const { modifiedUser, productsWanted } = extractUserCartProducts(user);

      await orderServices.create({
        profileId: user._id,
        productsOrdered: productsWanted,
      });

      await userServices.findByIdAndUpdate(user._id, modifiedUser);

      const populatedUser = await userServices.findByIdAndPopulate(user._id);

      const tokenDocument = await tokenServices.findByUserId(populatedUser._id);

      delete populatedUser.password;

      return res
        .status(201)
        .json({
          message: "You successfully made an order!",
          user: { ...populatedUser, accessToken: tokenDocument.token },
        });
    }

    if (!isUserRequest) {
      const productsWanted = formatNonUserProducts(data.products);

      await orderServices.create({ ...data, productsOrdered: productsWanted });

      return res
        .status(201)
        .json({ message: "You successfully made an order!" });
    }
  } catch (err) {
    if (err.path === "_id")
      res
        .status(400)
        .json({
          message: "Some if the id's you provided is not in valid format",
        });
    if (err.status) res.status(err.status).json({ message: err.message });
  }
};

const getUserOrdersHandler = async (req, res) => {
  console.log(`GET ${req.originalUrl}`);

  const { profileId } = req.params;

  try {
    const orders = await orderServices.findByUserId(profileId);

    return res.status(200).json({ orders });
  } catch (err) {
    if (err.path === "profileId")
      return res.status(400).json({ message: "Id is not in valid format" });
  }
};

router.post("/create", createOrderHandler);
router.get("/:profileId", getUserOrdersHandler);

module.exports = router;
