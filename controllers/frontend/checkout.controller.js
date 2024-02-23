const cartModel = require("../../models/cart.model");
const cartItemModel = require("../../models/cartItem.model");
const orderModel = require("../../models/order.model");
const orderItemModel = require("../../models/orderItem.model");

const checkout = async (req, res) => {
  try {
    let cart = await cartModel.findOne({ _id: req.params.cartId });

    if (cart) {
      let order = await orderModel.create({
        cart: req.params.cartId,
        user: cart.user,
        address: {
          name: "",
          email: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zipcode: "",
          contact: "",
        },
        subTotal: cart.subTotal,
        tax: cart.tax,
        grandTotal: cart.grandTotal,
      });

      let cartItems = await cartItemModel.find({ cartId: cart._id });

      for (const item of cartItems) {
        await orderItemModel.create({
          product: item.product,
          order: order._id,
          qty: item.qty,
        });
      }

      await cartModel.updateOne({ _id: cart._id }, { orderPlaced: true });

      return res.json({
        status: 202,
        message: "order placed",
      });
    } else {
      return res.json({
        status: 404,
        message: "cart not found",
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  checkout,
};
