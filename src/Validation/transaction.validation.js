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
        z.object({
            medicine:z.string()
                    .refine(val=> mongoose.Types.ObjectId.isValid(val),
                            val=>({message:`Invalid Medicine Id : ${val}`})),
            quantity:z.number().int().min(1,{message:"Atleast one item is required"}),
        })),  
    paymentId:z.string().uuid(),
    isComplete:z.boolean(),
    amount:z.number().int().positive(),
    } // will try to make regex for it 

);

export {transactionValidator};