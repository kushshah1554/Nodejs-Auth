const image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res
        .status(400)
        .json({ success: true, message: "please upload a photo" });
    }
    // console.log(req.file);

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the url and public id along with uploaded user id in database
    const newUploadedImage = new image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newUploadedImage.save();
    //delete file from local storage
    fs.unlinkSync(req.file.path);
    res
      .status(201)
      .json({
        success: true,
        message: "new image added in database successfully",
        image: newUploadedImage,
      });
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong!!! Please try again",
      });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    // console.log("params",req.params);
    // console.log("query",req.query);

    const sortBy = req.query.sortBy || "createdAt";
    const sortType = req.query.sortType === "asc" ? 1 : -1;
    const totalImages = await image.countDocuments({});
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortType;
    const images = await image.find({}).sort(sortObj).limit(limit).skip(skip);
    if (images) {
      res
        .status(200)
        .json({
          success: true,
          message: "All images fetch successfully",
          currentPage: page,
          totalPages,
          totalImages,
          data: images,
        });
    }
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong!!! Please try again",
      });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getCurrentImageIdForDelete = req.params.id;
    const currentUserId = req.userInfo.userId;

    //check image exist or not
    const dltImage = await image.findById(getCurrentImageIdForDelete);
    if (!dltImage) {
      return res
        .status(400)
        .json({ success: false, message: "image is not found" });
    }

    //check who is deleting the image only person who has upolad it can delete it
    const imageOwnerId = dltImage.uploadedBy.toString();
    if (imageOwnerId !== currentUserId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "you are not allowed to delete this image",
        });
    }

    //delete from cloudinary
    await cloudinary.uploader.destroy(dltImage.publicId);

    //delete from database
    const deletedImageFromDb = await image.findByIdAndDelete(
      getCurrentImageIdForDelete
    );

    if (deletedImageFromDb) {
      res
        .status(200)
        .json({
          success: true,
          message: "image delete successfully",
          data: deletedImageFromDb,
        });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "image canot be delete  from db",
        });
    }
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong!!! Please try again",
      });
  }
};

module.exports = { uploadImageController, fetchImageController, deleteImage };
