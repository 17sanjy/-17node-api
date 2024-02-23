const { getUsers, storeUser, editUser, updateUser, deleteUser } = require("../../controllers/backend/user.controller");
const { upload } = require("../../middleware/fileUploadMiddleware");

const express = require('express');
const router = express.Router();

router.get("/", getUsers);

router.post("/store", upload.single('image') , storeUser);

router.get("/edit/:id", editUser);

router.post("/update/:id", upload.single('image'), updateUser);

router.delete("/destroy/:id", deleteUser);

module.exports = router;