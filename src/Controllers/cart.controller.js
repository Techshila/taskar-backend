import { Cart } from "../Models/cart.model";
import ApiResponse from "../Utils/ApiResponse";

const show = async function(req,res){
    let images = [];
    let medinames = [];
    let prices = [];
    let qtys = [];
    await Cart.findOne({user:req.user._id}).then((item)=>{
        if(item){
            images = item.img;
            medinames = item.medinames;
            prices = item.prices;
            qtys = item.count_items;
        }
    });
    let totalqty = 0;
    for(let i=0;i<qtys.length;i++){
        totalqty+=qtys[i];
    }
    let totalprice = 0;
    for(let i=0;i<prices.length;i++){
        let priceone=0;
        for(let j=0;j<prices[i].length;j++){
            if(prices[i].charCodeAt(j)>=48 && prices[i].charCodeAt(j)<=57){
                priceone=priceone*10+(prices[i][j]-'0');
            }
        }
        totalprice+=priceone*qtys[i];
    }

    data = {
        image: imgs,
        productnames: prodnames,
        price: prices,
        qts: qtys,
        totalcnt: totalqty,
        totalmoney: totalprice
    }

    throw new ApiResponse(200,"Cart saved and added!!",data);
}

export { show };