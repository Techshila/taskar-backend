import {User} from "../Models/user.model.js";
import { Review } from "../Models/review.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {userValidator} from "../Validation/user.validation.js"
import {makePartialValidatorByPickingKeys} from "../Utils/Zod.js"
import {asyncHandler}  from "../Utils/asynchandler.js"


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
        console.log(safeParsedReqUser.error);
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
 
user.password = undefined;
user.refreshToken = undefined;
 
  return res.status(201).json(
      new  ApiResponse(201,"Registeration Successful",user)
  );
  }

  
);

const getAccessToken = async function(req,res){
  
};

const createreview = function (req, res) {
    Review.create({
      user: req.user._id,
      rating: req.body.rating,
      reviews: req.body.reviews,
    });
    res.json(new ApiResponse(200,"Created review successfully!!"));
  };

export {createreview,registerUser};

