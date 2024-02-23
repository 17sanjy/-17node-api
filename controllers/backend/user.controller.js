const userModel = require("../../models/user.model");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
// const { error } = require("console");

const getUsers = async (req, res) => {
  let users = await userModel.find();

  res.json(users);
};

const storeUser = async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.json({
      status: 201,
      message: "email has already been registered",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      image: req.file ? req.file.path.replace("public", "") : "",
      contactNumber: req.body.contactNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
      status: req.body.status,
    });

    res.json({
      status: 201,
      message: "new user has been added successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
};

const editUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id });
    if (user) {
      res.json({
        status: 201,
        message: "user id found",
        data: user,
      });
    } else {
      return res.json({
        status: 404,
        message: "user not found"
      })
    }
  } catch (error) {
    res.json({
      status: 404,
      message: "user not found",
      data: {},
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.file) {
      let user = await userModel.findOne({ _id: req.params.id });

      if (fs.existsSync(path.join(__dirname, "../../public", user.image))) {
        fs.unlinkSync(path.join(__dirname, "../../public", user.image));
      }

      await userModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          email: req.body.email,
          image: req.file.path.replace("public", ""),
          contactNumber: req.body.contactNumber,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          zipcode: req.body.zipcode,
          status: req.body.status,
        }
      );
    } else {
      await userModel.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          email: req.body.email,
          contactNumber: req.body.contactNumber,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          zipcode: req.body.zipcode,
          status: req.body.status,
        }
      );
    }

    res.json({
      status: 202,
      message: "user updated successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "id not exist",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.json({
        status: 404,
        message: "id not found",
      });
    }

    await userModel.deleteOne({ _id: req.params.id });

    res.json({
      status: 404,
      message: "user deleted successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "id not found",
    });
  }
};

module.exports = {
  getUsers,
  storeUser,
  editUser,
  updateUser,
  deleteUser,
};
