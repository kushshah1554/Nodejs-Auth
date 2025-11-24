const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    //1) extract user information from req.body or frontend
    const { username, email, password, role } = req.body;
    //2) check if user already exist or not
    const checkExistingUser = await user.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "user already exists please try another username or email",
        });
    }
    //3)bcrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //4) create new user and add in database
    const newUser = new user({
      //create new user
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save(); // add to database

    if (newUser) {
      res
        .status(201)
        .json({
          success: true,
          message: "newuser added successfully",
          data: newUser,
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: "New user can not be added " });
    }
  } catch (error) {
    console.log("Erroe+", error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!! please try again",
    });
  }
};

const loginUser = async (req, res) => {
  try {
   //1) extract user information from req.body or frontend
    const { username, password } = req.body;
    //2) check if current user exist or nor
    const curretUser = await user.findOne({ username });
    if (!curretUser) {
      return res
        .status(400)
        .json({ success: false, message: "this username does not exits" });
    }
    //3) check if password is correct or not
    const isCorrectPassword = await bcrypt.compare(
      password,
      curretUser.password
    );
    if (!isCorrectPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password is incorrect please try again",
        });
    }
    //4) create user token
    const accessToken = jwt.sign(
      {
        userId: curretUser._id,
        username: curretUser.username,
        role: curretUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );

    // console.log("tokken=", accessToken);

    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", accessToken });
  } catch (error) {
    console.log("Erroe+", error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!! please try again",
    });
  }
};

const changePassword=async(req,res)=>{
  try {
    //extract current user id
    const currentUserId=req.userInfo.userId;
    //extract old password and newpassword
    const {oldPassword,newPassword}=req.body;
    //find current user by id
    const currentUser=await user.findById(currentUserId);
    if(!currentUser)//check user exist or not in database
    {
      return res.status(400).json({success:false,message:"user is not found!!"});
    }

    //check old password is correct or not
    const isPasswordMatched=await bcrypt.compare(oldPassword,currentUser.password);

    if(!isPasswordMatched)
    {
      return res.status(400).json({success:false,message:"oldpassword does not match please try again!!"});
    }
    //hash new password if old password is correct
    const salt=await bcrypt.genSalt(10);
    const newHashedPassword=await bcrypt.hash(newPassword,salt);
    // store in database 
    currentUser.password=newHashedPassword;
    await currentUser.save();

    res.status(200).json({success:true,message:"password change successfully",data:currentUser});

    
  } catch (error) {
     console.log("Erroe+", error);
    res.status(500).json({
      success: false,
      message: "something went wrong!!! please try again",
    });
  }

}

module.exports = { registerUser, loginUser,changePassword};
