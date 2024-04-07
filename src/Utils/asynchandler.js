const asyncHandler = (fn) =>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch((err)=>{
     next(err);
   });
}  
//to wrap async middleware functions 
export {asyncHandler};