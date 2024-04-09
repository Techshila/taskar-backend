import {Schema,model} from "mongoose";

const cartSchema = new Schema({
    medinames: [
        {
        type: String
        }
    ],
    mediids: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Medicine'
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