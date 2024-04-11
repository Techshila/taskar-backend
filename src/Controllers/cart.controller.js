import { Cart } from "../Models/cart.model.js";
import { Medicine } from "../Models/medicine.model.js";
import ApiResponse from "../Utils/ApiResponse.js";

const add = async function(req,res){
    Medicine.find({_id:req.query.id}).then((ele)=>{
        Cart.findOne({user:req.user._id}).then((e)=>{
            if(!e){
                Cart.create({
                    medinames:[ele[0].name],
                    prices:[ele[0].price],
                    mediids: [req.query.id],
                    count_items: [1],
                    user:req.user._id
                });
            }else{
                let flag = false;
                for(let i=0;i<e.medinames.length;i++){
                    if(e.medinames[i]==ele[0].name){
                        let val = e.count_items[i];
                        e.count_items[i]=val+1;
                        e.save();
                        flag=true;
                    }
                }
                if(!flag){
                    e.medinames.push(ele[0].name);
                    e.mediids.push(ele[0]._id);
                    e.prices.push(ele[0].price);
                    e.count_items.push(1);
                    e.save();
                }
            }
        })
    });
    res.json(new ApiResponse(200,"Added to Cart successfully!!"));
};

const show = async function(req,res){
    let medinames = [];
    let prices = [];
    let qtys = [];
    await Cart.findOne({user:req.user._id}).then((item)=>{
        if(item){
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

   let data = {
        medinames: medinames,
        price: prices,
        qts: qtys,
        totalcnt: totalqty,
        totalmoney: totalprice
    }

    res.json(new ApiResponse(200,"Cart saved and added!!",data));
}

const addqty = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        item.count_items[req.params.idx]+=1;
        item.save();
    })
    res.status(200).json(new ApiResponse(200,"Added quantity successfully!!"));
}

const subtractqty = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        if(item.count_items[req.params.idx]>1){
            item.count_items[req.params.idx]-=1;
            item.save();
        }
    })
    res.status(200).json(new ApiResponse(200,"Subtracted quantity successfully!!"));
}

const del = function(req,res){
    Cart.findOne({user:req.user._id}).then((item)=>{
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        for(let i=0;i<item.medinames.length;i++){
            if(i!=req.params.idx){
                a.push(item.mediids[i]);
                b.push(item.medinames[i]);
                c.push(item.prices[i]);
                d.push(item.count_items[i]);
            }
        }
        item.mediids = a;
        item.medinames = b;
        item.prices = c;
        item.count_items = d;
        item.save();
    })
    res.json(new ApiResponse(200,"Deleted item successfully!!"));
}

export default  { add,show,del,addqty,subtractqty };