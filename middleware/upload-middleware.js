const multer=require("multer");
const path=require("path");
// console.log("type=",typeof multer);
// console.log("object key=",Object.keys(multer));

//set our multer storage it means where to store image in local storage
const storage=multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"uploads/");
    },
    filename:(req,file,cd)=>{
        cd(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
});

//file filter function
const checkFileFilter=(req,file,cd)=>{
    if(file.mimetype.startsWith("image")){
        cd(null,true);
    }else{
        cd(new Error("Not an image!!! Please upload image only"));
    }
};
//multer middleware
module.exports=multer({
    storage:storage,
    fileFilter:checkFileFilter,
    limits:{
        fileSize:5*1024*1024 //5MB file size limit
    }

});
