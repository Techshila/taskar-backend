import { Medicine } from "../Models/medicine.model";
import ApiResponse from "../Utils/ApiResponse";

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

export {display};