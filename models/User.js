const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const salt = 15;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    validate: [/^[a-z-']+$/i, "First name is not in valid format"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    validate: [/^[a-z-']+$/i, "Last name is not in valid format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [/[0-9]/, "Password should contain only numbers"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is not in valid format",
    ],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    validate: [/^[a-z -']+$/i, "Country is not in valid format"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
    validate: [/^[a-z -']+$/i, "City is not in valid format"],
  },
  street: {
    type: String,
    required: [true, "Street is required"],
    validate: [/^[a-z -'0-9]+$/i, "Street is not in valid format"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
    validate: [/[A-Za-z]+$/i, "Street is not in valid format"],
  },
  zipCode: {
    type: String,
    required: [true, "Zip Code is required"],
    validate: [/^[A-Z0-9]+$/g, "Zip Code is not in valid format"],
  },
  unitNumber: {
    type: String,
    required: [true, "Unit number is required"],
    validate: [/[0-9]+$/gm, "Unit number is not in valid format"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: [/[0-9]+$/i, "Phone number is not in valid format"],
  },

  favourites: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    }
      
  ],
  cart: [
    {
      _id:{type: mongoose.Types.ObjectId,
      ref: 'Product'},
      size: String,
      quantity:Number
    }  
  ],
  isAdmin: {
    type:Boolean,
    default:false
  }
});

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, salt, function (err, hash) {
    if (err) {
      next(err);
    } else {
      user.password = hash;
      next();
    }
  });
});

userSchema.pre("updateOne", function (next) {
  const user = this._update;
  bcrypt.hash(user.password, salt, function (err, hash) {
    if (err) {
      next(err);
    } else {
      user.password = hash;
      next();
    }
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
