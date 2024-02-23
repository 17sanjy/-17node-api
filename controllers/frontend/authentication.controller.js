const userModel = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
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

const login = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });

    if (user) {
      let authenticatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (authenticatePassword) {
        let token = jwt.sign({user}, 'secret');
        return res.json({
          status: 200,
          message: "Logined Successfully",
          token: token
        });
      } else {
        return res.json({
          status: 404,
          message: "Email id and Password do not match!",
        });
      }
    } else {
      return res.json({
        status: 404,
        message: "user not found",
      });
    }
  } catch (error) {
    return res.json({
        status: 404,
        message: "email not exist"
    })
  }
};

module.exports = {
  register,
  login,
};
