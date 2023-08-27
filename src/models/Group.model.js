const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  joinRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Track user IDs requesting to join
  ],
  joinRequestsApproval: {
    type: Map,
    of: Boolean,
    default: {} // Initialize with an empty object
  },
  totalSavings: {
    type: Number,
    default: 0,
  },
  // Other group-related fields
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
