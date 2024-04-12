import  {Schema , model } from "mongoose";    
import bcrypt from "bcrypt";  
import ApiError from "../Utils/ApiError.js";
import { pointSchema } from "../Utils/Schema.js";
import {Store} from "./store.model.js"
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        index:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    addresses: [{ 
        street: String, 
        city: String, 
        state: String, 
        pinCode: Number, 
        location:{
            type:pointSchema,
            index:"2dsphere",
         },
        defaultaddress : Boolean ,
    }],

    isStoreManager:{
        type:Boolean,
        default:false,
    },

    isCEO:{
        type:Boolean,
        default:false,
    },
    avatar:{
        type:String, //cloudinary url
    },
    orders:[{
        type:Schema.Types.ObjectId,
        ref:"Transaction"
    }],
    refereshToken:{
        type:String,
    },
   
    
},{
    timestamps:true,
})
// userSchema.index({location:"2dsphere"});   //geospatial indexing need to read about it a bit first 
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        console.log(this);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.verifyPassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (err) {
        throw new ApiError(500, "Error in comparing password", [err]);
    }
};
userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        name:this.firstName+" "+this.lastName,
        phone:this.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign({
        _id:this._id,  
    })
}
userSchema.methods.getStoreFromNearestToFarthest = async function(){
 
};

export const User = model("User",userSchema);