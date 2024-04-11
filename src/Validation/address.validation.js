import {z} from 'zod';


 const  addressesValidator = z.array(z.object({
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
  }));
  export {addressesValidator}