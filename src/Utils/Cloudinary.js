import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});
const uploadOnCloud = async (localfilePath)=>{
    try{
        if(!localfilePath){
            return null;
        }
        //upload function start 
        const result = await cloudinary.uploader.upload(localfilePath,{
            folder:"profile/image",
            use_filename:true,//could use username as filename so well defined structure hoga
            unique_filename:true,
            auto_tagging:0.6,
        });
        //file uploaded successfully 
        //delete file from the local storage
        fs.unlinkSync(localfilePath);
        return result ;
    }catch(err){
       // we will give some time for him to reupload 
       // if this  function resulted in error we ask user to upload again 
       console.log(err);
       fs.unlinkSync(localfilePath);//not sync but we won't move further unless its done kinda sync
       return null;
    }
}
export default uploadOnCloud;