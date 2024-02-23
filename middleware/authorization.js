const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    // invalid token
    const decoded = jwt.verify(req.headers.authorization, "secret");
    if (!decoded) {
      return res.json({
        status: 404,
        message: "please login first",
      });
    }

    next();
  } catch (error) {
    return res.json({
      status: 404,
      message: "please login",
    });
  }
};

module.exports = {
  authorization,
};
