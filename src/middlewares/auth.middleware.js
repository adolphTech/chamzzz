const jwt =require("jsonwebtoken");
const User =require("../models/User.model.js");

// protect routes
const protect = async (req, res, next) => {
  let token;

  // Read the JWT from cookie
  token = req.cookies.jwt;

  // console.log(token)


  if (token) {
    try {
      // Verify the token and decode user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Retrieve user data excluding the password
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({message:"Not authorized, token failed"});
    }
  } else {
    res.status(401).json({message:"Not authorized, no token"});
  }
};

// admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Admin");
  }
};
 
module.exports = { protect, admin };
