import {Schema,model} from "mongoose";
const transactionSchema = new Schema({ 
    buyer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    store:[{
        type:Schema.Types.ObjectId,
        ref:"Store",
        required:true,
    }],

    paymentId:[{ //status ,order id , and all can be fetched from razorpay using this id
        type:String, //razorpay payment id
        required:true,
    }],

    items:[{
        medicine:{type:Schema.Types.ObjectId,
        ref:"Medicine",},
        quantity:{
            type:Number,
            required:true,
        },
    }],
},{timestamps:true});

export const Transaction = model("Transaction",transactionSchema);