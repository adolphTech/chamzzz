const User =require( "../../models/User.model")
const {generateToken }= require("../../utils/generateToken")




// @desc register user
// @route POST api/users/register
// @access Public
const registerUser = async (req, res) => {
    try {
      const { name, phone, idNumber, email, password, isAdmin, balance } = req.body;
  
      // Check if user with the same email or phone already exists
      const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  
      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }
  
      const user = await User.create({
        name,
        phone,
        idNumber,
        email,
        password,
        isAdmin,
        balance,
      });
  
      if (user) {
        generateToken(res, user._id);
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone:user.phone,
          idNumber:user.idNumber,
          balance:user.balance,          
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  // @desc Auth user & token
// @route POST api/users/login
// @access Public

const authUser = async(req,res)=>{
    try{
        const {email,password}= req.body;

        const user = await User.findOne({email})
     
        if(user && (await user.matchPassword(password))){
          generateToken(res,user._id)
     
         res.json({
            _id: user._id,
          name: user.name,
          email: user.email,
          phone:user.phone,
          idNumber:user.idNumber,
          balance:user.balance,          
          isAdmin: user.isAdmin,
     
         })
        }else{
         res.status(401)
         throw new Error("Invalid email or password")
        }
        

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


// @desc fetch all users
// @route GET api/users/all
// @access Admin
const getAllUsers = async (req, res) => {
    try {
      // Check if the logged-in user has admin privileges
      // if (!req.user.isAdmin) {
      //   res.status(403); // Forbidden
      //   throw new Error("You do not have permission to access this route.");
      // }
  
      // Fetch all users from the database
      const users = await User.find();
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// @desc Logout user /clear  cookie
// @route POST api/users/LOGOUT
// @access Private

const logoutUser = async(req,res)=>{
  try{
    res.cookie("jwt","",{
      httpOnly:true,
      expires:new Date(0)
  }).status(200).json({message:"logged out success"})
  }catch(e){
    res.status(500).json({ error: error.message });
  }
 
}
  

  



module.exports = { logoutUser,registerUser,getAllUsers,authUser}