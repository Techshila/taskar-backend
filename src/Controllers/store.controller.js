import {Store} from "../Models/store.model.js";


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


export {getNearestStore} 