import {z} from 'zod';  

const categoryValidator = z.object({
    name:z.string({
        required_error:"Category Name is required",
        invalid_type_error:"Category Name must be a string",
      })
      .trim()
      .min(3,{message:"Category Name must be atleast 3 characters long"})
      .max(50,{message:"Category Name must be atmost 50 characters long"}),
      
    description:z.string({
          required_error:"Description is required",
          invalid_type_error:"Description must be a string",
      })
      .trim()
      .min(10,{message:"Description must be atleast 10 characters long"})
      .max(500,{message:"Description must be atmost 500 characters long"}),

    
});

export {categoryValidator};