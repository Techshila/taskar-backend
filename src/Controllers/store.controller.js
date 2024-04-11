import {Store} from "../Models/store.model.js";
import { storeValidator } from "../Validation/store.validation.js";
import { userValidator } from "../Validation/user.validation.js";
import { makePartialValidatorByOmmittingKeys, makePartialValidatorByPickingKeys, makefieldsOptionalInValidator } from "../Utils/Zod.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {User} from "../Models/user.model.js";
import { Medicine } from "../Models/medicine.model.js";

const getNearestStore = async function(location){
    let stores = await Store.find({
        $near: {
            $geometry: {
               type: "Point" ,
               coordinates: this.location.coordinates
            },
       }});
        return stores;
}
const registerStore = async function(req,res){
     const userId = req.user?._id;
    if(!userId){
        throw new ApiError(500,"Unauthorised Request");}
    const {location,Inventory} = req.body;
    const reqStore = {location,Inventory,manager:userId};
    const reqStoreValidator = makefieldsOptionalInValidator(storeValidator,["Inventory"]);
    const safeParsedReqStore = reqStoreValidator.safeParse(reqStore);
     if (!safeParsedReqStore.success) {
        throw new ApiError(400, safeParsedReqStore.error.errors);}
    const store =  await Store.create(reqStore);
    if(!store){
        throw new ApiError(500,"Error in registering  store!!");
    }
    res.status(200).json(new ApiResponse(200,"Added Store successfully!!",{store}));
}
const verifyStore = async function(req,res){
   const  requserId = req.user?._id;
   if(!requserId){
       throw new ApiError(482,"Unauthorised Request");
   }
   if(!requserId==process.env.ADMIN_ID){
    throw new ApiError(481,"Unauthorised Request");
}
  const storeId = req.body.storeId;
  if(!storeId){
      throw new ApiError(400,"StoreId is required!!");
  }
  const store = await Store.findByIdAndUpdate({storeId},{isVerified:true},{new:true});
  if(!store){
      throw new ApiError(500,"Error in verifying store!!");
  }
  res.status(200).json(new ApiResponse(200," Store successfully Verified ",store));
}

const storeManagerLogin = async function(req,res){ 
    const  { email,username,password } = req.body || {}; // we might have more than these keys init 
    //now figguring out which of the one is present either email or password 
    //defining keys to make partial validator 
    let keys = ["password"];
    let  loginReq ={
        password,
    };
    if(email){
      keys.push("email");
      loginReq.email = email;
    }else{
        keys.push("username");
        loginReq.username = username;
    }
    //making partial schema
    const loginValidator = makePartialValidatorByPickingKeys(userValidator,keys);
    //validating inputs 
    const safeParsedLogin = loginValidator.safeParse(loginReq);
    if(!safeParsedLogin.success){
        throw new ApiError(489,"Invalid Login Details",safeParsedLogin.error.errors);
    }
    //validation done 
    //find if user exist or not 
    let searchedUser={};
   
    //searching
    try{
    if(keys[1]=="email"){
    searchedUser = await User.findOne({
        email,
    })
    }else{
     searchedUser = await User.findOne({
        username,
     })   
    }}catch(err){
        throw new ApiError(500,"Error in finding user",[err],err.stack);
    }
    //if user not found
    (!searchedUser) && res.status(404).json(
        new ApiResponse(404,"User does not exist",null),
    );
    //if user found compare password 
   const isPasswordCorrect =  searchedUser.verifyPassword(password);
   if(!isPasswordCorrect){
    throw new ApiError(419,"Invalid Credentials");
   }    
   //if password is correct then proceeding to store manager login 
    const store = await Store.findOne({manager:searchedUser._id});
    if(!store){
        throw new ApiError(500,"No Store Associated with this User");
    }
    //store found
    //updating userRole
    
    if(!searchedUser.isStoreManager){
        searchedUser.isStoreManager = true;
        
    const finalUser =  await searchedUser.save({validateBeforeSave:false})
    if(!finalUser){
        throw new ApiError(500,"Error in updating user role");
    }
    res.status(200).json(new ApiResponse(200,"Store Manager Logged in Successfully!!",{store,finalUser}));     
}
    res.status(200).json(new ApiResponse(200,"Store Manager Logged in Successfully!!",{store,searchedUser}));

 }

const addToInventory = async function(req,res){
    const {id,name,quantity} = req.body;
    let mediId = "";
    await Medicine.find({}).then((medicine) => {
        if(medicine){
            for(let i=0;i<medicine.length;i++){
                if(medicine[i].name==name){
                    mediId = medicine[i]._id;
                    break;
                }
            }
        }
    })
    if(mediId==""){
        throw ApiError(504,"Medicine not found!!");
    }
    await Store.findById(id).then((store) => {
        if(store){
            let addInv = {medicine: mediId, quantity: quantity};
            store.Inventory.push(addInv);
            store.save();
        }
    });
    
    res.json(new ApiResponse(200,"Added to Inventory successfully!!"));
}

const updateInventory = async function(req,res){
    const {id,medicine,quantity} = req.body;
    await Store.findById(id).then((store) => {
        let a = store.Inventory;
        for(let i=0;i<a.length;i++){
            if(a[i].medicine==medicine){
                store.Inventory[i].quantity = quantity;
                break;
            }
        }
        store.save();
    })
    res.json(new ApiResponse(200,"Updated Inventory successfully!!"));
}

const deleteFromInventory = async function(req,res){
    let b = [];
    const {id,medicine} = req.body; 
    await Store.findById(id).then((store) => {
        let a = store.Inventory;
        for(let i=0;i<a.length;i++){
            if(a[i].medicine!=medicine){
                b.push(a[i]);
            }
        }
        store.Inventory = b;
        store.save();
    })
    res.json(new ApiResponse(200,"Deleted from Inventory successfully!!"))
}

export {getNearestStore,verifyStore,registerStore,storeManagerLogin,addToInventory,updateInventory,deleteFromInventory} 
