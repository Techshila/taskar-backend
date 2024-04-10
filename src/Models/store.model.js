import { Schema,model } from "mongoose";
import { pointSchema } from "../Utils/Schema.js";   

const storeSchema = new Schema({
    location:{
        type:pointSchema,
        index:"2dsphere",
    },
    manager:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    Inventory:[{
        medicine:{
            type:Schema.Types.ObjectId,
            ref:"Medicine",
        },
        quantity:{
            type:Number,
            required:true,
        }
    }]

},{timestamps:true});

export const Store = model("Store",storeSchema);