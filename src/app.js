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
app.use('/api/v1',indexRouter);
//category routes
import categoryRouter from "./Routes/category.route.js"
app.use("/api/v1/category",categoryRouter);

//store routes 
import storeRouter from "./Routes/store.routes.js"
app.use("/api/v1/store",storeRouter);


//medicine routes   
import medicineRouter from "./Routes/medicine.route.js"
app.use("/api/v1/medicine",medicineRouter);


//transaction routes
import transactionRouter from "./Routes/transaction.route.js"
app.use("/api/v1/transaction",transactionRouter);










app.use((err,req,res,next)=>{
   res.status(err.statusCode).json(
    new ApiResponse(err.statusCode,err.message,err[0],false)
   )
}
)
export {app};
