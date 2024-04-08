import {z} from 'zod';
import mongoose from 'mongoose';

const storeValidator = z.object({
    location:z.object({
        type:z.enum(["Point"]),
        coordinates:z.array(z.number())
        .length(2,{message:"Invalid Coordinates"}),
    }),
    manager:z.string()
            .refine(val=> mongoose.Types.ObjectId.isValid(val),
                    val=>({message:`Invalid User Id for Manager: ${val}`})),
    Inventory:z.array(
        z.object({
            medicine:z.string()
                    .refine(val=> mongoose.Types.ObjectId.isValid(val),
                            val=>({message:`Invalid Medicine Id: ${val}`})),
            quantity:z.coerce.number({required_error:"Quantity is required"})
                    .positive({message:"Quantity must be positive"})
        })
    ),
  
})
export {storeValidator};