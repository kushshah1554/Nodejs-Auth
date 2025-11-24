
const isAdmin=(req,res,next)=>{
    if(req.userInfo.role!=="admin")
    {
       return res.status(403).json({success:false,message:"Sorry only Admin are available"});
    }
    next();
}

module.exports=isAdmin;