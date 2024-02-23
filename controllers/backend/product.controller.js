const fs = require("fs");
const path = require("path");
const productModel = require("../../models/product.model");

const getProducts = async (req, res) => {
  let products = await productModel.find().populate('category');
  res.json(products);
};

const storeProduct = async (req, res) => {
  let product = await productModel.findOne({ name: req.body.name });

  if (product) {
    return res.json({
      status: 201,
      message: " product name already exist.",
    });
  }

  try {
    await productModel.create({
      name: req.body.name,
      slug: req.body.slug,
      image: req.file ? req.file.path.replace("public", "") : "",
      shortDescription: req.body.slug,
      description: req.body.slug,
      slug: req.body.slug,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      status: req.body.status,
    });

    res.json({
      status: 201,
      message: "product added successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id });

    if (product) {
      res.json({
        status: 201,
        message: "product id found",
        data: product,
      });
    } else {
      return res.json({
        status: 404,
        message: "id not exist"
      })
    }
  } catch (error) {
    res.json({
      status: 404,
      message: "product not found",
      data: {},
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.file) {
      let product = await productModel.findOne({ _id: req.params.id });

      if (fs.existsSync(path.join(__dirname, "../../public", product.image))) {
        fs.unlinkSync(path.join(__dirname, "../../public", product.image));
      }

      await productModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          slug: req.body.slug,
          image: req.file.path.replace("public", ""),
          shortDescription: req.body.shortDescription,
          description: req.body.description,
          price: req.body.price,
          quantity: req.body.quantity,
          category: req.body.category,
          status: req.body.status,
        }
      );
    } else {
      await productModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          slug: req.body.slug,
          shortDescription: req.body.slug,
          description: req.body.slug,
          slug: req.body.slug,
          price: req.body.price,
          quantity: req.body.quantity,
          category: req.body.category,
          status: req.body.status,
        }
      );
    }

    res.json({
      status: 201,
      message: "product updated successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "id not exist",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id });
    if (!product) {
      return res.json({
        status: 404,
        message: "id not exist",
      });
    }

    await productModel.deleteOne({ _id: req.params.id });

    res.json({
      status: 201,
      message: "product deleted successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  storeProduct,
  editProduct,
  updateProduct,
  deleteProduct,
};
