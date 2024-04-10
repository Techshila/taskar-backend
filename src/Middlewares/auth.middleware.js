import ApiError from "../Utils/ApiError.js";


const authMiddleware = async function(req, _, next) {
    try{
        const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(490,"Unauthorized access");
        }
        let decodedToken= {};
        try{
         decodedToken = await jwt.verify(token,process.env.JWT_SECRET);//to make sure its the token made by server only not some malacious token put by user
        }catch(err){
            throw new ApiError(491,err.message);
        }
        req.user = decodedToken;
        next();
        }catch(err){
         next(err);   
        };
    }

export default authMiddleware;

