import { Medicine } from "../Models/medicine.model.js";
import ApiResponse from "../Utils/ApiResponse.js";

const search = async function(req,res){
    let searchItem = req.params.id;
    console.log(searchItem);
    let a = [];
    await Medicine.find({}).then((ele) => {
        if(ele){
            for(let i=0;i<ele.length;i++){
                let medi = ele[i];
                let name = medi.name.toLowerCase();
                console.log(name);
                if(name.includes(searchItem)){
                    a.push(ele[i]);
                }
            }
        }
    })
    return res.json(new ApiResponse(200,"Searched successfully!!",a));
}

export { search };