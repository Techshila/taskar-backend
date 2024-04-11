import {Schema,model} from "mongoose";

const medicineSchema = new Schema({
    name:{ //compositon
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true,
    },
    manufacturer:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
    },
    displayImages:[{
        type:String,//cloudinary urls 
    }],
    categories:[{
        type:Schema.Types.ObjectId,
        ref:"Category",
    }],
    description:{
        type:String, //might get a link from timyMCE
        required:true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }]
    
},{timestamps:true});
export const Medicine  = model("Medicine",medicineSchema);