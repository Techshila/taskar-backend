import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
app.use('/',require('./routes/index'));

export {app};
