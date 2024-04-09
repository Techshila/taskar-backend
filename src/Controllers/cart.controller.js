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

const addqty = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        item.count_items[req.params.idx]+=1;
        item.save();
    })
    throw new ApiResponse(200,"Added quantity successfully!!");
}

const subtractqty = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        if(item.count_items[req.params.idx]>1){
            item.count_items[req.params.idx]-=1;
            item.save();
        }
    })
    throw new ApiResponse(200,"Subtracted quantity successfully!!");
}

const del = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        for(let i=0;i<item.img.length;i++){
            if(i!=req.params.idx){
                a.push(item.images[i]);
                b.push(item.medinames[i]);
                c.push(item.prices[i]);
                d.push(item.count_items[i]);
            }
        }
        item.images = a;
        item.medinames = b;
        item.prices = c;
        item.count_items = d;
        item.save();
    })
    throw new ApiResponse(200,"Deleted item successfully!!");
}

export { show,del,addqty,subtractqty };