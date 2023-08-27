const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getAllUsers,
  logoutUser
   
} = require("./User.controller");

const { protect, admin } =require ("../../middlewares/auth.middleware");

router.route("/").post(registerUser).get(protect,getAllUsers);
router.post("/auth",authUser);
router.post("/logout",logoutUser)

module.exports = router;