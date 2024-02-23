const cartModel = require("../../models/cart.model");
const cartItemModel = require("../../models/cartItem.model");
const userModel = require("../../models/user.model");

const getCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.params.userId, orderPlaced: false })
      .populate("user");
    if (cart) {
      let response = await responseData(cart);

      return res.json({
        status: 202,
        message: "cart found",
        data: response,
      });
    } else {
      return res.json({
        status: 404,
        message: "cart not created",
        data: {},
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const addCart = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.userId });

    if (user) {
      let cart = await cartModel.findOne({
        user: req.params.userId,
        orderPlaced: false,
      });
      if (cart) {
        let itemExist = await cartItemModel.find({
          cartId: cart.id,
          product: req.body.productId
        })

        if(itemExist){
          await cartItemModel.updateOne({
            cartId: cart.id,
            product: req.body.productId
          }, 
          {
            qty: req.body.qty
          })
        } else {
          await cartItemModel.create({
            cartId: cart.id,
            product: req.body.productId,
            qty: req.body.qty,
          });
        }


      } else {
        let cart = await cartModel.create({
          user: req.params.userId,
        });

        await cartItemModel.create({
          cartId: cart.id,
          product: req.body.productId,
          qty: req.body.qty,
        });
      }

      await collectTotal(cart.id);

      let response = await responseData(cart);

      return res.json({
        status: 202,
        message: "cart found",
        data: response,
      });
    }
    return res.json({
      status: 404,
      message: "Customer not found",
      data: {},
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const updateCart = async (req, res) => {
  console.log("hello update cart");
};

const responseData = async (cart) => {
  let newCart = { ...cart._doc };

  let cartItems = await cartItemModel
    .find({ cartId: cart.id })
    .populate("product");

  newCart.items = cartItems;

  return newCart;
};

const collectTotal = async (cartId) => {
  let cart = await cartModel.findOne({ _id: cartId });

  let cartItems = await cartItemModel
    .find({ cartId: cart.id })
    .populate("product");

  let subTotal = 0;
  let tax = 0;
  let grandTotal = 0;

  for (const item of cartItems) {
    subTotal = subTotal + item.product.price * item.qty;
  }

  grandTotal = subTotal + tax;

  await cartModel.updateOne(
    { _id: cart.id },
    {
      subTotal: subTotal,
      tax: tax,
      grandTotal: grandTotal,
    }
  );
};

module.exports = {
  getCart,
  addCart,
  updateCart,
};
