import {z} from 'zod';
import mongoose from 'mongoose';    

const transactionValidator = z.object({
    buyer:z.string()
           .refine(val=> mongoose.Types.ObjectId.isValid(val),
                   val=>({message:`Invalid User Id for Buyer: ${val}`})),
    store:z.string()
           .refine(val=> mongoose.Types.ObjectId.isValid(val),
                   val=>({message:`Invalid Store Id : ${val}`})),
    items:z.array(
        z.string()
        .refine(val=> mongoose.Types.ObjectId.isValid(val),     
                val=>({message:`Invalid Medicine Id : ${val}`}))
    ).min(1,{message:"Atleast one item is required"}),  
    paymentId:z.string(), // will try to make regex for it 

});

export {transactionValidator};