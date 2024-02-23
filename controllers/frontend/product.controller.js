const productModel = require("../../models/product.model");

const getProducts = async (req, res) => {
  let products = await productModel.find().populate("category");

  res.json(products);
};

const productById = async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id });
    if (product) {
      return res.json({
        status: 202,
        message: "product exists",
        data: product,
      });
    } else {
      return res.json({
        status: 404,
        message: "id not exist",
      });
    }
  } catch (error) {
    return res.json({
      status: 404,
      message: "product not found",
      data: {},
    });
  }
};

module.exports = {
  getProducts,
  productById,
};
