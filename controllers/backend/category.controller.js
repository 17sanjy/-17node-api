const categoryModel = require("../../models/category.model");
const fs = require("fs");
const path = require("path");

const getCategories = async (req, res) => {
  let categories = await categoryModel.find();

  res.json(categories);
};

const storeCategory = async (req, res) => {
  let category = await categoryModel.findOne({ name: req.body.name });
  if (category) {
    return res.json({
      status: 201,
      message: "name already exist.",
    });
  }

  try {
    await categoryModel.create({
      name: req.body.name,
      image: req.file ? req.file.path.replace("public", "") : "",
      status: req.body.status,
    });

    res.json({
      status: 201,
      message: "category name added successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
};

const editCategory = async (req, res) => {
  try {
    let category = await categoryModel.findOne({ _id: req.params.id });

    if (category) {
      res.json({
        status: 202,
        message: " category id found",
        data: category,
      });
    }
  } catch (error) {
    res.json({
      status: 404,
      message: "category not found",
      data: {},
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    if (req.file) {
      let category = await categoryModel.findOne({ _id: req.params.id });
      
      if (fs.existsSync(path.join(__dirname, "../../public/", category.image))) {
        fs.unlinkSync(path.join(__dirname, "../../public/", category.image));
      }

      await categoryModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          image: req.file.path.replace("public", ""),
          status: req.body.status,
        }
      );
    } else {
      await categoryModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          status: req.body.status,
        }
      );
    }

    res.json({
      status: 202,
      message: "category updated successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "id not exist",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    let category = await categoryModel.findOne({ _id: req.params.id });
    if (!category) {
      return res.json({
        status: 404,
        message: "id not found",
      });
    }
    await categoryModel.deleteOne({ _id: req.params.id });

    res.json({
      status: 202,
      message: "category deleted successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "id not found",
    });
  }
};

module.exports = {
  getCategories,
  storeCategory,
  editCategory,
  updateCategory,
  deleteCategory,
};
