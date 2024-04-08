import {Schema,model} from "mongoose";  
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        upperCase:true,
    },
    description:{
        type:String,
        required:true,
    }
},{timestamps:true});

export const Category = model("Category",categorySchema);   