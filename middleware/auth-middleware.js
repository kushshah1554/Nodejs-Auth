const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {//check token is available or not
    return res
      .status(401)
      .json({
        success: false,
        message: "token is not available!!!please pass a token or login",
      });
  }

  //decode token and check token is valid or not if not throw error so use try and catch if it is syn if async then callback is used to catch error
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("decodedTokenInfo=", decodedTokenInfo);
    req.userInfo = decodedTokenInfo;
    next();
  } catch (e) {
    console.log("error:",e);
    return res
      .status(500)
      .json({ success: false, message: "token is not valid or expired" });
  }
};

module.exports = authMiddleware;
