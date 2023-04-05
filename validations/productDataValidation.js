const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];

const clothingOptions = [
  "t-shirts",
  "sweatshirts",
  "jackets",
  "tracksuits",
  "shorts",
];
const shoeOptions = [
  "lifestyle",
  "running",
  "football",
  "gym",
  "boxing and wrestling",
];

const genders = ["men", "women", "boys", "girls"];

const brands = ["nike", "jordan", "adidas"];

const colors = [
  "black",
  "white",
  "yellow",
  "green",
  "red",
  "blue",
  "grey",
  "navy",
  "orange",
];

const validateIsAllDataSend = (data) => {
  if (
    !data.type ||
    !data.category ||
    !data.name ||
    !data.gender ||
    !data.brand ||
    !data.imageUrl ||
    !data.color ||
    !data.price ||
    !data.sizes
  )
    throw {
      status: 400,
      message:
        "Type, category, brand, gender, imageUrl, color, price, sizes should be provided in order to continue!",
    };
};

const validateDataType = (data) => {
  if (data.type !== "clothing" && data.type !== "shoes") {
    throw { status: 400, message: "Type should be clothing or shoes!" };
  }
};

const validateDataCategory = (data) => {
  if (data.type === "clothing") {
    if (!clothingOptions.includes(data.category)) {
      throw {
        status: 400,
        message: `Clothing type does not support${data.category}!`,
      };
    }
  }
  if (data.type === "shoes") {
    if (!shoeOptions.includes(data.category)) {
      throw {
        status: 400,
        message: `Shoes type does not support${data.category}!`,
      };
    }
  }
};

const validateName = (data) => {
  if (!/[\w\s-]+/gi.test(data.name)) {
    throw { status: 400, message: "Name is not in valid format." };
  }
};

const validateDataGender = (data) => {
  if (!genders.includes(data.gender)) {
    throw { status: 400, message: `Genders does not support${data.gender}!` };
  }
};

const validateDataBrand = (data) => {
  if (!brands.includes(data.brand)) {
    throw { status: 400, message: `Brands does not support${data.brand}!` };
  }
};

const validateDataImageUrl = (data) => {
  if (
    !/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i.test(
      data.imageUrl
    )
  ) {
    throw { status: 400, message: "ImageUrl is not valid!" };
  }
};

const validateDataColor = (data) => {
  if (!colors.includes(data.color.toLowerCase())) {
    throw { status: 400, message: "Color is not valid!" };
  }
};

const validateDataPrice = (data) => {
  if (isNaN(data.price)) {
    throw { status: 400, message: "Price should be a number!" };
  }
};

const validateDataSizesValues = (data) => {
  for (const key in data.sizes) {
    if (isNaN(data.sizes[key])) {
      throw { status: 400, message: "Size value is not valid!" };
    }
  }
};

const validateDataSizes = (data) => {
  let comparisionArray = [];
  if (data.type === "clothing") comparisionArray = clothingSizes;
  if (data.type === "shoes") comparisionArray = shoeSizes;

  for (const key in data.sizes) {
    if (!comparisionArray.includes(key))
      throw {
        status: 400,
        message: `${data.type} does not support size ${key}!`,
      };
  }

  comparisionArray.forEach((size) => {
    if (!data.sizes.hasOwnProperty(size)) {
      data.sizes[size] = 0;
    }
  });
  return data;
};

const validateAndFormatDataSizes = (data) => {
  if (data.type === "clothing") {
    clothingSizes.map((size) => {
      for (let key in data.sizes) {
        if (!clothingSizes.includes(key))
          throw {
            status: 400,
            message: "The sizes you entered are not supported for clothing!",
          };

        if (data.sizes.hasOwnProperty(size)) {
          if (isNaN(data.sizes[key])) {
            throw {
              status: 400,
              message: "The sizes you entered are not valid!",
            };
          }
        }
        if (!data.sizes.hasOwnProperty(size)) {
          data.sizes[size] = 0;
        }
      }
    });
  }
  if (data.type === "shoes") {
    shoeSizes.map((size) => {
      for (let key in data.sizes) {
        if (!shoeSizes.includes(key))
          throw {
            status: 400,
            message: "The sizes you entered are not supported for shoes!",
          };
        if (data.sizes.hasOwnProperty(size)) {
          if (isNaN(data.sizes[key])) {
            throw {
              status: 400,
              message: "The sizes you entered are not valid!",
            };
          }
        }
        if (!data.sizes.hasOwnProperty(size)) {
          data.sizes[size] = 0;
        }
      }
    });
  }
  return data;
};

const validateAllData = (data) => {
  validateIsAllDataSend(data);
  validateDataType(data);
  validateDataCategory(data);
  validateName(data);
  validateDataGender(data);
  validateDataBrand(data);
  validateDataImageUrl(data);
  validateDataColor(data);
  validateDataImageUrl(data);
  validateDataPrice(data);
  validateDataSizesValues(data);
  const validatedData = validateDataSizes(data);
  return validatedData;
};

const productDataValidation = {
  validateAndFormatDataSizes,
  validateAllData,
};

module.exports = productDataValidation;
