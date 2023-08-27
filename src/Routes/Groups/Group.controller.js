const Group =require( "../../models/Group.model")


// @desc create group
// @route POST api/group
// @access Private
const createGroup = async (req, res) => {
   
    try {
        const { name } = req.body;
        const owner = req.user._id; // Assuming user is authenticated and user object is attached to req
    
        // Create a new group
        const group = await Group.create({
          name,
          owner,
          members: [owner], // Owner is automatically added as a member
        });
    
        res.status(201).json(group);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  };

// @desc  all groups
// @route get api/group
// @access Private
//@admin
const getAllGroups = async (req, res) => {
  try {
    

    // Fetch all users from the database
    const groups = await Group.find();

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc  a NEW member requesting to join the group
// @route post api/:groupId/
// @access Private

const joinGroupRequest = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id; // Assuming user is authenticated and user object is attached to req

    // Fetch the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is already a member of the group
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member of the group" });
    }

    // Check if the user has already requested to join this group
    if (group.joinRequests.includes(userId)) {
      return res.status(400).json({ message: "User has already requested to join this group" });
    }

    // Add the user's request to join the group
    group.joinRequests.push(userId);
    await group.save();

    res.json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc each member approve join request
// @route post "/:groupId/join-requests/:requestId/approve"
// @access Private


 const approveRequest = async (req, res) => {
  try {

    const groupId = req.params.groupId;
    const requestId = req.params.requestId;
    const userId = req.user._id; // Assuming user is authenticated and user object is attached to req


    // Fetch the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is a member of the group
    if (!group.members.includes(userId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Find the request in the joinRequests array
    const joinRequestIndex = group.joinRequests.indexOf(requestId);
    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: "Join request not found" });
    }

    // Check if the user has already approved/rejected this request
    if (group.joinRequestsApproval[userId]) {
      return res.status(400).json({ message: "You have already responded to this request" });
    }

    // Update the joinRequestsApproval object to store user's decision
    group.joinRequestsApproval[userId] = req.body.approve;

    // Check if all members have approved the request
    const allMembersApproved = group.members.every((member) => {
      return member !== userId || group.joinRequestsApproval[member] === true;
    });

    if (allMembersApproved) {
      // Remove the request from joinRequests and add the user to members
      group.joinRequests.splice(joinRequestIndex, 1);
      group.members.push(requestId);

      // Clear joinRequestsApproval object
      group.joinRequestsApproval = {};

      await group.save();

      return res.json({ message: "All members have approved. Request handled" });
    }

    await group.save();

    res.json({ message: "Your response has been recorded" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

  module.exports = {createGroup,getAllGroups,joinGroupRequest,approveRequest}