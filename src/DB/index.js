import mongoose from "mongoose";
export const connectDB = async (dbName) => {
    try{
        const connectionObj = await mongoose.connect(process.env.MONGODB_URI,{
            dbName,
        });
        console.log("connected to the MongoDb host : " ,connectionObj.connection.host);
      }catch(err){
        console.error("Error in connecting to DB: ", err);
        process.exit(1);
      };
}