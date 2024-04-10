import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiResponse from "./Utils/ApiResponse.js";
const app = express();
app.use(express.json({
    limit:"16kb"
}));    
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
    }))
app.use(cookieParser());
app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))
app.use(express.static("public"))

//import routes 

//route declarations
//address routes
import addressRouter from "./Routes/addrress.route.js"
app.use("/api/v1/address",addressRouter);
//user routes
import userRouter from "./Routes/user.route.js"
app.use("/api/v1/user",userRouter);
//index routes
import indexRouter from "./Routes/index.route.js"
app.use('/',indexRouter);

//store routes 
import storeRouter from "./Routes/store.routes.js"
app.use("/api/v1/store",storeRouter);













app.use((err,req,res,next)=>{
   res.status(err.statusCode).json(
    new ApiResponse(err.statusCode,err.message,err[0],false)
   )
}
)
export {app};
