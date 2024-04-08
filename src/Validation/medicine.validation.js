import {z} from 'zod';
import mongoose from 'mongoose';    

const medicineValidator = z.object({
    name: z.string()
            .min(3, {message: "Medicine name  should be atleast 3 characters long"}),
    manufacturer: z.string()
                    .min(3,{message:"Manufacturer name should be atleast 3 characters long"})
                    .max(50,{message:"Manufacturer name should be atmost 50 characters long"}),

    price: z.coerce.number().nonnegative(),
    displayImages: z.array(z.string().url()),
    categories: z.array(z.string()
                        .refine(val=> mongoose.Types.ObjectId.isValid(val),
                                val=>({message:`Invalid Category Id : ${val}`}))),
    description: z.string().url(),
    expiration: z.date(),
    reviews: z.array(z.string()
                    .refine(val=> mongoose.Types.ObjectId.isValid(val),
                            val=>({message:`Invalid Review Id : ${val}`}))),

});

export {medicineValidator};
