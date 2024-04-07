import multer from "multer";
import path from "node:path"
import ApiError from "../Utils/ApiError.js";    
//my particular usecase is images so i will use filefilter to filter out only images and i can specify a image size so that my server wouldn't be overloaded 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/temp");
    },
    filename:(req,file,cb)=>{
       cb(null,Date.now()+"-"+file.originalname);
    }
});
 export  const multerUpload = multer({ 
    storage,
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        switch(ext){
            case ".jpg" : 
            case ".jpeg" :
            case ".png" : cb(null,true);
            break;
            default:cb(new ApiError(412,"File Type Not Supported",[]),false);
        }
    },
    limits:{
        fileSize:1024*1024*2,//slightly greater than 2mb
    }
    
});