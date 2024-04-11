import {User} from "../Models/user.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ApiError from "../Utils/ApiError.js";
import { userValidator } from "../Validation/user.validation.js";
import { makePartialValidatorByPickingKeys } from "../Utils/Zod.js";
import {addressesValidator}  from "../Validation/address.validation.js";


const getAddresses = async function(req,res){
    const user_id = req.user?._id;
    if(!user_id) { 
        throw new ApiError(411,"Something went wrong with authMiddleware") 
    }
  
    const user = await User.findById(user_id);
    if(!user){
        throw new ApiError(412,"User not found in database") 
    }
    const addresses = user.addresses;
    res.status(200).json( new ApiResponse(200,"Addresses fetched successfully",addresses));
    
};

const updateAddresses = async function(req,res){
    const {addresses} = req.body;
    // const addressValidator = makePartialValidatorByPickingKeys(userValidator,["addresses"]);
    const safeParsedAddresses = addressesValidator.safeParse(addresses);
    if(!safeParsedAddresses.success){
        console.log(safeParsedAddresses.error);
        throw new ApiError(413,"Invalid addresses format");
    }
    const user_id = req.user?._id;
    if(!user_id) { 
        throw new ApiError(411,"Something went wrong with authMiddleware") 
    }
  
    const user = await User.findById(user_id);
    if(!user){
        throw new ApiError(412,"User not found in database") 
    }
    user.addresses = addresses;
    const savedUser = await user.save({
        validateBeforeSave:false,
    });
    if(!savedUser){
        throw new ApiError(414,"Error in saving user while updating addresses");
    }
    res.status(200).json( new ApiResponse(200,"Addresses updated successfully",savedUser.addresses));


};




export {getAddresses,updateAddresses};