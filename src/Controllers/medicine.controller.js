import { Medicine } from "../Models/medicine.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { makefieldsOptionalInValidator } from "../Utils/Zod.js";
import { medicineValidator } from "../Validation/medicine.validation.js";
import ApiError from "../Utils/ApiError.js";
import uploadOnCloud from "../Utils/Cloudinary.js";

const display = async function(req,res){
    let a = [];
    await Medicine.find({})
        .populate("categories")
        .sort("-createdAt")
        .then((medicines)=>{
            for(let i=0; i<medicines.length; i++){
                var b = [];
                b.push(medicines[i].name);
                b.push(medicines[i].manufacturer);
                b.push(medicines[i].price);
                b.push(medicines[i].displayImages);
                b.push(medicines[i].categories);
                b.push(medicines[i].description);
                b.push(medicines[i].expiration);
                b.push(medicines[i].reviews);
                a.push(b);
            }
        })
    res.json(new ApiResponse(200,"Medicines stored!!",a));
};
const addMedicine = async function(req,res){
    const {name,manufacturer,price,categories,description,reviews} = req.body;
    const reqMedicine = {name,manufacturer,price,categories,description,reviews}
    const addMedicineValidator = makefieldsOptionalInValidator(medicineValidator,["reviews","categories","displayImages"]);
  
    const saferParsedMedicine = addMedicineValidator.safeParse(reqMedicine);

    if (!saferParsedMedicine.success) {
        throw new ApiError(489, saferParsedMedicine.error.errors[0].message, saferParsedMedicine.error.errors);
    }
    let displayImagesLocalPath = [];

    if(req.files?.length>0){
    for (let i = 0; i < req.files?.length; i++) {
        
        displayImagesLocalPath.push(req.files[i].path);
    }
    }
    //uploading on cloudinary
    let displayImagesCloudinaryPath = [];
    if(displayImagesLocalPath.length>0){
        for(let i=0;i<displayImagesLocalPath.length;i++){
            try{
            let image = await uploadOnCloud(displayImagesLocalPath[i]);
            displayImagesCloudinaryPath[i] = image.secure_url;
            
            }catch(err){
                throw new ApiError(500,"Error in uploading image",[err]);
        }
    }
    
    }
    

    const medicine = await Medicine.create({
        ...reqMedicine,
        displayImages: displayImagesCloudinaryPath
    });
    if (!medicine) {
        throw new ApiError(500, "Error in creating medicine");
    }
    res.status(201).json(new ApiResponse(201, "Medicine created", medicine));
}
const fetchMedicineByCategory = async function(req,res){
    console.log(req.query)
    const categoryID = req.query?.categoryID;
    if(!categoryID){
        throw new ApiError(400,"Category ID is required!!");
    }
   const medicines= await Medicine.aggregate(
        [
            [
                {
                  '$unwind': {
                    'path': '$categories', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$match': {
                    'categories': categoryID,
                  }
                }, {
                  '$limit': 30
                }
              ]
          ]
    );
    if(!medicines){
        throw new ApiError(500,"Error in fetching medicines!!");
    }
    res.status(200).json(new ApiResponse(200,"Fetched Medicines successfully!!",{medicines}));
}

export  {display,addMedicine,fetchMedicineByCategory};