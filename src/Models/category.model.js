import {Schema,model} from "mongoose";  

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    }

},{timestamps:true});

export const Category = model("Category",categorySchema);