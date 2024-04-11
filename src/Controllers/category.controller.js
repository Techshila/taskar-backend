import { Category } from "../Models/category.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import uploadOnCloud from "../Utils/Cloudinary.js";

const AdminId = process.env.ADMIN_ID;

const addCategory = async (req, res) => {
    if(req.user._id!=AdminId){
        throw ApiError(500,"Admin not matched!!",[]);
    }
    const {name,description} = req.body;

    const image = req.file?.path;
    if(!image){
        throw new ApiError(489,"No file uploaded");
    }
    const imageCloudinary = await uploadOnCloud(image);
    if(!imageCloudinary){
        throw new ApiError(489,"Error in uploading avatar");
    }
    const imageCloudinaryPath = imageCloudinary.secure_url;

    await Category.create({
        name: name,
        description: description,
        image: imageCloudinaryPath
    });
    res.json(new ApiResponse(200,"Added Category successfully!!"));
}

const deleteCategory = async (req, res) => {
    if(req.user._id!=AdminId){
        throw ApiError(500,"Admin not matched!!",[]);
    }
    let id = req.params.id;
    await Category.findByIdAndDelete(id);
    res.json(new ApiResponse(200,"Deleted Category successfully!!"));
  }

const fetchCategory = async (req,res) => {
    let categories = [];
    await Category.find({}).then((cat) => {
        if(cat){
            for(let i=0;i<cat.length;i++){
                let b = [];
                let onecat = cat[i];
                b.push(onecat);
                categories.push(b);
            }
        }
    })
    res.json(new ApiResponse(200,"Fetched Category successfully!!",categories));
}


export {addCategory ,fetchCategory, deleteCategory};