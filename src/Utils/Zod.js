
import ApiError from "./ApiError.js";


const makePartialValidatorByPickingKeys = (zodValidator,keys) => {
    if(keys.length==0 ){
        return schema.deepPartial(); // all fields are optional at nested level 
    };
    const arrayOfKeysOfPartialValidator  = zodValidator.keyof().options;
  
    let options = {};
    
    for (let key of keys){
        if(arrayOfKeysOfPartialValidator.includes(key)){
            options[String(key)] = true;
        }else{
            throw new ApiError(400,`Invalid User field choosen to make partial zodSchema: ${key}`);
        }
    }
    console.log(options);
    return zodValidator.pick(options);
};
const makePartialValidatorByOmmittingKeys = (zodValidator,keys) => {
    if(keys.length==0 ){
        return schema.deepPartial(); // all fields are optional at nested level 
    };
    const arrayOfKeysOfPartialValidator  = zodValidator.keyof().options;
  
    let options = {};
    
    for (let key of keys){
        if(arrayOfKeysOfPartialValidator.includes(key)){
            options[String(key)] = true;
        }else{
            throw new ApiError(400,`Invalid User field choosen to make partial zodSchema: ${key}`);
        }
    }
    return zodValidator.omit(options);
};

const makefieldsOptionalInValidator = (zodValidator,keys) => {
    if(keys.length==0 ){
        return schema.deepPartial(); // all fields are optional at nested level 
    };
    const arrayOfKeysOfPartialValidator  = zodValidator.keyof().options;
  
    let options = {};
    
    for (let key of keys){
        if(arrayOfKeysOfPartialValidator.includes(key)){
            options[String(key)] = true;
        }else{
            throw new ApiError(400,`Invalid User field choosen to make partial zodSchema: ${key}`);
        }
    }
    return zodValidator.partial(options);

};
export {makePartialValidatorByPickingKeys,makePartialValidatorByOmmittingKeys,makefieldsOptionalInValidator};