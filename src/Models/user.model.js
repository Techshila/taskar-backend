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
        default : boolean ,
    }],
    role:{
        type:String,
        required:true,
        enum:["user","storeManager","CEO"],
        default:"user"
    },
    avatar:{
        type:String, //cloudinary url
    },
    orders:[{
        type:Schema.Types.ObjectId,
        ref:"Order"
    }],
    refereshToken:{
        type:String,
    },
    location:{
       type:pointSchema,
       index:"2dsphere",
    }
    
},{
    timestamps:true,
})
// userSchema.index({location:"2dsphere"});   //geospatial indexing need to read about it a bit first 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    };
    bcrypt.hash(this.password,10)
    .then((token)=>{
        this.password = token;
       next();
    }).catch((err)=>{
        next(err);
    });

});

userSchema.methods.verifyPassword = async function(password){
    let isMatch;
    bcrypt.compare(password,this.password)
    .then((result)=>{
        isMatch = result;    
    })
    .catch((err)=>{
    throw new ApiError(500,"Error in comparing password",[err]);
    });

}
userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        name:this.firstName+" "+this.lastName,
        role:this.role,
        phone:this.phoneNumber,
        },
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign({
        _id:this._id,  
    })
}
userSchema.methods.getStoreFromNearestToFarthest = async function(){
   let stores = await Store.find({
    $near: {
        $geometry: {
           type: "Point" ,
           coordinates: this.location.coordinates
        },
   }});
    return stores;
};

export const User = model("User",userSchema);