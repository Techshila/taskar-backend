import { Medicine } from "../Models/medicine.model.js";
import ApiResponse from "../Utils/ApiResponse.js";

const display = async function(req,res){
    let a = [];
    await Medicine.find({})
        .populate("Category")
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
    const {name,manufacturer,price,displayImages,categories,description,expiration,reviews} = req.body;
    const newMedicine = new Medicine({
        name,
        manufacturer,
        price,
        displayImages,
        categories,
        description,
        expiration,
        reviews
    });
    newMedicine.save().then(()=>{
        res.json(new ApiResponse(200,"Medicine added successfully!!"));
    }).catch((err)=>{
        res.json(new ApiResponse(500,"Error in adding medicine!!"));
    });
}
export default {display};