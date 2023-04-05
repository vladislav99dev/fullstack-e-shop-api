const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    validate: [/^[a-z-']+$/i, "First name is not in valid format"],
  },
  lastName: {
    type: String,
    validate: [/^[a-z-']+$/i, "Last name is not in valid format"],
  },
  email: {
    type: String,
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is not in valid format",
    ],
  },
  country: {
    type: String,
    validate: [/^[a-z -']+$/i, "Country is not in valid format"],
  },
  city: {
    type: String,
    validate: [/^[a-z -']+$/i, "City is not in valid format"],
  },
  street: {
    type: String,
    validate: [/^[a-z -'0-9]+$/i, "Street is not in valid format"],
  },
  state: {
    type: String,
    validate: [/[A-Za-z]+$/i, "Street is not in valid format"],
  },
  zipCode: {
    type: String,
  },
  unitNumber: {
    type: String,
  },
  phoneNumber: {
    type: String,
    validate: [/[0-9]+$/i, "Phone number is not in valid format"],
  },
  productsOrdered: [
    {
      id: { type: mongoose.Types.ObjectId, ref: "Product" },
      size: String,
      quantity: Number,
    },
  ],
  price: {
    type:Number
  },
  profileId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  orderStatus: {
    type: String,
    default:'Not Delivered'
  },
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
