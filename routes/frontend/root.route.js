const express = require('express');

const router = express.Router();

// authentication routes
const authenticationRoute = require('./authentication.route');

// product routes
const productRoutes = require('./product.route');

// category routes
const categoryRoutes = require('./category.route');

// cart routes
const cartRoutes = require('./cart.route');

// checkout routes
const checkoutRoutes = require('./checkout.route');

router.use(authenticationRoute);
router.use(productRoutes);
router.use(categoryRoutes);
router.use(cartRoutes);
router.use(checkoutRoutes);

module.exports = router;