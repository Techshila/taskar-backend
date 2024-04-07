import {Schema , model } from " mongoose ";

const reviewSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
   
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }

}, {timestamps:true});

const Review = model("Review",reviewSchema);