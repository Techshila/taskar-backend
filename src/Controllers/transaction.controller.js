import {Transaction} from "../Models/transaction.model.js";
import { transactionValidator } from "../Validation/transaction.validation.js";
import {makefieldsOptionalInValidator} from "../Utils/Zod.js";

const addTransactions = async function(req,res){
    const {items,buyer,store,amount,paymentId} = req.body;
    const reqTransaction = {items,buyer,store,amount,paymentId};
    const reqtransactionValidator = makefieldsOptionalInValidator(transactionValidator,["isComplete"]);
    const safeParsedReqTransaction = reqtransactionValidator.safeParse(reqTransaction);
    if(!safeParsedReqTransaction.success){
        throw new ApiError(489,safeParsedReqTransaction.error.errors[0].message,safeParsedReqTransaction.error.errors);
    }
    //transaction is validated 
    
    const transaction = await Transaction.create(safeParsedReqTransaction.data);
    
}