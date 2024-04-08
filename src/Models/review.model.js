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
        type:String, //currently thinking it  as tinymce  url
        required:true,
    }

}, {timestamps:true});

export const Review = model("Review",reviewSchema);