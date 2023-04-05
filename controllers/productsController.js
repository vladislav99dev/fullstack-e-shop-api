const router = require("express").Router();

const productsServices = require("../services/products/productsServices");

const extractEmptyPropsAndSizesFromFilter = require("../utils/products/extractEmptyPropsAndSizesFromFilter");
const filterProductsBySize = require("../utils/products/filterProductsBySize");

const getManyHandler = async (req, res) => {
  console.log(`GET ${req.originalUrl}`);

  const gender = req.path.split("/")[1];

  let products = [];

  if (
    gender !== "men" &&
    gender !== "women" &&
    gender !== "boys" &&
    gender !== "girls" &&
    gender !== "sale" &&
    gender !== "all"
  )
    return res
      .status(400)
      .json({ message: "No such gender found in database!" });

  try {
    if (gender === "all") products = await productsServices.findAll();
    if (gender === "sale") products = await productsServices.findSale();

    if (gender !== "all" && gender !== "sale")
      products = await productsServices.findByGender(gender);
    res.status(200).json(products);
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const getManyFiltered = async (req, res) => {
  console.log(`POST ${req.originalUrl}`);

  const data = req.body;

  const { filterData, filterSizes } = extractEmptyPropsAndSizesFromFilter(data);

  try {
    let products = await productsServices.findAndFilter(filterData);

    if (products.length === 0)
      return res.status(200).json({ products: products });

    const sizeFilteredProducts = filterProductsBySize(products, filterSizes);

    // if(sizeFilteredProducts.length === 0) return res.status(200).json({products:sizeFilteredProducts})

    return res.status(200).json({ products: sizeFilteredProducts });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
  }
};

const getOneHandler = async (req, res) => {
  console.log(`GET ${req.originalUrl}`);

  const { productId } = req.params;

  try {
    const product = await productsServices.findById(productId);

    res.status(200).json(product);
  } catch (err) {
    if (err.path === "_id")
      return res.status(400).json({ message: "ProfileId is invalid!" });
    if (err.status)
      return res.status(err.status).jsson({ message: err.message });
  }
};

router.get(
  ["/men", "/women", "/girls", "/boys", "/all", "/sale"],
  getManyHandler
);
router.post("/filter", getManyFiltered);
router.get("/:productId", getOneHandler);

module.exports = router;
