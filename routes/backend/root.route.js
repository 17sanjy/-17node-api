const express = require('express');
const router = express.Router();

// category route
const categoryRoute = require('./category.route');

// product route
const productRoute = require('./product.route');

// user route
const userRoute = require('./user.route');

const { authorization } = require('../../middleware/authorization');
router.use(authorization);

router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/user", userRoute);

module.exports = router;