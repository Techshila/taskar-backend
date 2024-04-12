import {Transaction} from "../Models/transaction.model.js";
import { transactionValidator } from "../Validation/transaction.validation.js";
import {makefieldsOptionalInValidator} from "../Utils/Zod.js";
import {User} from "../Models/user.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

const addTransaction = async function(req,res){
    const {items,buyer,store,amount,paymentId} = req.body;
    const reqTransaction = {items,buyer,store,amount,paymentId};
    const reqtransactionValidator = makefieldsOptionalInValidator(transactionValidator,["isComplete"]);
    const safeParsedReqTransaction = reqtransactionValidator.safeParse(reqTransaction);
    if(!safeParsedReqTransaction.success){
        throw new ApiError(489,safeParsedReqTransaction.error.errors[0].message,safeParsedReqTransaction.error.errors);
    }
    //transaction is validated 
    
    const transaction = await Transaction.create(reqTransaction);
    if(!transaction){
        throw new ApiError(500,"Error in adding transaction!!");
    }
    //adding to user orders 
    const user  = await User.findByIdAndUpdate(buyer,{$push:{orders:transaction._id}},{new:true});
    if(!user){
        throw new ApiError(500,"Error in adding transaction to user!!");
    }
    res.status(200).json(new ApiResponse(200,"Added Transaction successfully!!",transaction));

    
}

export {addTransaction}