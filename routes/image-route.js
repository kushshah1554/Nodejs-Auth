
const express=require("express");
const authMiddleware=require("../middleware/auth-middleware");
const isAdmin=require("../middleware/admin-middleware");
const uploadMiddleware=require("../middleware/upload-middleware");
const {uploadImageController,fetchImageController,deleteImage}=require("../controllers/image-controller");

const router=express.Router();
//upload the image
router.post("/upload",authMiddleware,isAdmin,uploadMiddleware.single("images"),uploadImageController);
 //get all the images
 router.get("/get",authMiddleware,fetchImageController);
 //delete image
 router.delete("/:id",authMiddleware,isAdmin,deleteImage);
module.exports=router;