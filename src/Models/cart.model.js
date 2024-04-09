import {Schema,model} from "mongoose";

const cartSchema = new Schema({
    images: [
        {
        type: String
        }
    ],
    medinames: [
        {
        type: String
        }
    ],
    prices: [
        {
        type: String
        }
    ],
    count_items: [
        {
            type: Number
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps: true
});

export const Cart = model("Cart",cartSchema);