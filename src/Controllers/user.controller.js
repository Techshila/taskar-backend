import {User} from "../Models/user.model.js";
import { Review } from "../Models/review.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {userValidator} from "../Validation/user.validation.js"
import {makePartialValidatorByPickingKeys} from "../Utils/Zod.js"
import {asyncHandler}  from "../Utils/asynchandler.js"
import uploadOnCloud from "../Utils/Cloudinary.js"
import { Medicine } from "../Models/medicine.model.js";
import { Store } from "../Models/store.model.js";


const registerUser = asyncHandler(async (req, res) => {
    
    
    const {firstName,lastName,email,password,username,phoneNumber} = req.body;
    const reqUser = {
        firstName,
        lastName,
        email,
        password,
        username,
        phoneNumber, 
    };
    const partialuserValidator = makePartialValidatorByPickingKeys(userValidator,["firstName","lastName","email","password","username","phoneNumber"])

    const safeParsedReqUser = partialuserValidator.safeParse(reqUser);
    if(!safeParsedReqUser.success){
        // console.log(safeParsedReqUser.error);
        throw new ApiError(489,safeParsedReqUser.error.errors[0].message,safeParsedReqUser.error.errors);//with express 5 if no error handler 
       //is found then it will be handled by express default error handler (thrown or rejected promise)
    };
    //data other than avatar is fetched and validated 
    //i should check first if User exist or not before uploading avatar to database 
    let mongoUserSearched;
      try{
        mongoUserSearched = await User.find({ //coz both could be found as well 
        $or:[
            {email},
            {username}
        ]
     })}catch(err){
            throw new ApiError(500,"Error in finding user",[err],err.stack);
           //if error is found execution will be stopped

     }
     //find returns a empty array if no user found findOne returns null 

     if(mongoUserSearched.length != 0){
        let errors = {};
        for(let i = 0;i<mongoUserSearched.length;i++){ //maximum 2 users can be found
            if(mongoUserSearched[i].email==email){
                errors.email="Email already exists";
            }
            if(mongoUserSearched[i].username==username){
                errors.username="Username already exists";
            }
        }
       throw new ApiError(402,"User Already Exists",[errors])
       }


     
    //now we have everything we require to save user in database
    //we will remove password and refreshToken from reqUser
   
 let user={};//how do i deal with this    
  try{
  user = await  User.create({
        ...reqUser,
    });
}catch(err){
    throw new ApiError(500,"Error in saving user",[err],err.stack);
}
const accessToken = await user.generateAccessToken()
user.password = undefined;
user.refreshToken = undefined;
const options = {
    httpOnly:true,
    secure:true,
}

 
  return res.status(201)
  .cookie("accessToken",accessToken,options)
  .json(
      new  ApiResponse(201,"Registeration Successful",user)
  )
  ;
  }

  
);

const loginUser = asyncHandler(async (req,res,next)=>{
    //extracting email or username / password from body 
    //checking of access token and we store user details in that only 
    //validating inputs 
    //verifying inputs 
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
   //now password is correct 
   searchedUser.password = undefined;
   searchedUser.refreshToken = "saasdf";
   const options = {
    httpOnly: true,
    secure: true
}
  const accessToken = await searchedUser.generateAccessToken()
  const sahiUser = searchedUser.toObject();
  sahiUser.accessToken = accessToken;

   res.status(202)
   .cookie("accessToken",accessToken,options)
   .json(
    new ApiResponse(202,"Log in Successful",sahiUser)
   )
})
const deleteUser = async function(req,res){
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized User");
    }
    const deleted = await User.deleteOne({_id:userId});
    if(!deleted){
        throw new ApiError(500,"Error in deleting user");
    }
    res.status(200).json(new ApiResponse(200,"User Deleted Successfully",{}));
}

const logOut = async function(req,res){
   const userId = req.user?._id; 
   if(!userId){
       throw new ApiError(401,"Unauthorized User");
   }
   const options = {
    httpOnly: true,
    secure: true,
   }
   res.status(201)
   .clearCookie("accessToken",options)
   .json(new ApiResponse(201,"Logged Out Successfully",{}));
   
}
const updateUser = async function(req,res){
    const {firstName,lastName,email,password,username,phoneNumber} = req.body;
    const reqUser = {firstName,lastName,email,password,username,phoneNumber}
    const updatedUserValidator = userValidator.deepPartial();
    const safeParsedUpdatedUser = updatedUserValidator.safeParse(updatedUserValidator);
    if(!safeParsedUpdatedUser.success){
        throw new ApiError(489,"Invalid User Details",safeParsedUpdatedUser.error.errors);
    }
    const userId = req.user._id;
  const updatedUser = await  User.findByIdAndUpdate(userId,
       reqUser,
    {new:true});
    updateUser.password = undefined;
    updateUser.refreshToken = undefined;
    res.json(new ApiResponse(200,"User Updated Successfully",updatedUser));
};
const updateUserAvatar = async function(req,res){
    const userId = req.user._id;
    const avatartLocalPath = req.file?.path;
    if(!avatartLocalPath){
        throw new ApiError(489,"No file uploaded");
    }
    const avatarCloudinary = await uploadOnCloud(avatartLocalPath);
    if(!avatarCloudinary){
        throw new ApiError(489,"Error in uploading avatar");
    }
    const avatartCloudinaryPath = avatarCloudinary.secure_url;
    const user = await User.findByIdAndUpdate(userId,{avatar:avatartCloudinaryPath},{new:true});
    res.status(203).json(
        new ApiResponse(203,"Avatar Updated Successfully",user.avatar)
    );
    
}
const createreview = async function (req, res) {
    let reviewId = "";
    await Review.create({
      user: req.user._id,
      rating: req.body.rating,
      reviews: req.body.reviews,
    }).then((ele) => {
        reviewId = ele._id;
    });
    let mediid = req.params.id;
    console.log(mediid);
    console.log(reviewId);
    await Medicine.findById(mediid).then((ele) => {
        console.log(ele);
        ele.reviews.push(reviewId);
        ele.save();
    })
    res.json(new ApiResponse(200,"Created review successfully!!"));
  };
const getNearestStore = async function(req,res){
    const {latitude,longitude} = req.body;
    const user = req.user;
    if(!user){
        throw new ApiError(401,"Unauthorized User");
    }
   
    const store = await Store.aggregate([
        {
          '$geoNear': {
            'near': {
              'type': 'Point', 
              'coordinates': [
                longitude, latitude
              ]
            }, 
            'distanceField': 'distance.calculated', 
            'query': {
              'isVerified': true
            }, 
            'includeLocs': 'distance.location', 
            'spherical': true
          }
        }, {
          '$limit': 1
        }
      ])
    res.json(new ApiResponse(200,"Nearest Store Found",store));
}

const getUser = async function(req,res){
        try {
          // Get the access token from the Authorization header
          const accessToken = req.headers.authorization;
      
          // Find the user with the provided access token
          const user = await User.findOne({ firstName:"Karthik" });
      
          if (!user) {
            return res.status(401).json({ error: 'Invalid access token' });
          }
      
          // Return the user data
          res.json(user);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
};

export {createreview,registerUser,loginUser,updateUser,updateUserAvatar,logOut,deleteUser,getNearestStore,getUser};

