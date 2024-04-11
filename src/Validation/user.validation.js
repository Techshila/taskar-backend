import {ZodArray, z} from 'zod';
import mongoose from "mongoose";

const userValidator = z.object({
    firstName:z.string({
        required_error:"First Name is required",
        invalid_type_error:"First Name must be a string",
      })
      .trim()
      .toLowerCase()
      .min(3,{message:"First Name must be atleast 3 characters long"})
      .max(50,{message:"First Name must be atmost 50 characters long"}),
      
      
    lastName:z.string({
          required_error:"Last Name is required",
          invalid_type_error:"Last Name must be a string",
      })
      .trim()
      .toLowerCase()
      .min(3,{message:"Last Name must be atleast 3 characters long"})
      .max(50,{message:"Last Name must be atmost 50 characters long"}),
  
    username:z.string({
          required_error:"Username is required",
          invalid_type_error:"Username must be a string",
      })
      .trim() 
      .min(5,{message:"Username must be atleast 5 characters long"})
      .max(12,{message:"Username must be atmost 12 characters long"})
      .regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{5,12}$/igm,{message:"Username must be alphanumeric and can contain .(dot) and _ (underscore)"}),
  
    email:z.string({
          required_error:"Email is required",
          invalid_type_error:"Email must be a string",
      })
      .trim()
      .email({message:"Invalid Email"}),
      
  
    password:z.string({
          required_error:"Password is required",
          invalid_type_error:"Password must be a string",
      })
      .trim()
      .min(8,{message:"Password must be atleast 8 characters long"})
      .max(64,{message:"Password must be atmost 64 characters long"})
      .regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g,{message:"Password must contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character"}),
  
    avatar:z.string()
      .url(),
      
    phoneNumber:z.coerce.number()
      .lte(9999999999,{message:"Invalid Phone Number"})
      .gte(1000000000,{message:"Invalid Phone Number"}), 
    
   

    refereshToken : z.string(),
    
    addresses:z.array(z.object({
          street:z.string().trim(),
          city:z.string().trim(),
          state:z.string().trim(),
          defaultaddress:z.boolean(),
          pinCode:z.coerce.number()
                .lte(999999,{message:"Invalid Pin Code"})
                .gte(100000,{message:"Invalid Pin Code"})
                ,
          location:z.object({
                  type:z.enum(["Point"]),
                  coordinates:z.array(z.number()).length(2,{message:"Invalid Coordinates"}),
              })      
        })),
    orders:z.array(
        z.string()
        .refine(val=> mongoose.Types.ObjectId.isValid(val),
                (val)=>({message:`Invalid Order Id: ${val}`}))  
    ),
  

})

export {userValidator};