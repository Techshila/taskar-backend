import {z} from 'zod';
import mongoose from 'mongoose';

const reviewValidator = z.object({
    user:z.string()
           .refine(val=> mongoose.Types.ObjectId.isValid(val),
                   val=>({message:`Invalid User Id for User: ${val}`})),
    rating:z.number().int().min(1).max(5),
    review:z.string().url(),
});
export {reviewValidator};