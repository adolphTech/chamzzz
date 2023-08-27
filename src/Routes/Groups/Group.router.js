const express = require("express");
const router = express.Router();
const {createGroup,getAllGroups,joinGroupRequest,approveRequest} = require("./Group.controller");

const { protect, admin } =require ("../../middlewares/auth.middleware");

router.route("/").post(protect,createGroup).get(protect,getAllGroups);
router.route("/:groupId/join-request").post(protect,joinGroupRequest)
router.route("/:groupId/join-requests/:requestId/approve").post(protect,approveRequest)

module.exports = router; 