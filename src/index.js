import dotenv from 'dotenv';
import { connectDB } from './DB/index.js'; 
import {app} from './app.js';
dotenv.config({
    path:"./.env"//relative path will work from where terminal has called the process or cwd()
});
connectDB("mainDB")
.then(()=>{
    app.on("error",(err)=>{
        console.log("Error in app connection: ", err);
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("Error in connecting to DB: ", err);
})