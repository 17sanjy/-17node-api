const express = require('express');
const { checkout } = require('../../controllers/frontend/checkout.controller');
// const { authorization } = require('../../middleware/authorization');

const router = express();

// router.use(authorization);
router.post("/checkout/:cartId", checkout);

module.exports = router;