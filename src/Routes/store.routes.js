import {Router} from "express";
import { getNearestStore ,registerStore,verifyStore,storeManagerLogin, addToInventory, deleteFromInventory, updateInventory } from "../Controllers/store.controller.js";
import authMiddleware from "../Middlewares/auth.middleware.js";
import { multerUpload } from "../Middlewares/multer.middleware.js";
const router = Router();

router.get("/getNearestStore",getNearestStore) ;

router.post("/registerStore",authMiddleware,registerStore);
router.post("/verifyStore",authMiddleware,verifyStore);
router.post("/storeManagerLogin",multerUpload.none(),storeManagerLogin);

router.post("/addInventory",authMiddleware,addToInventory);
router.post("/deleteInventory",authMiddleware,deleteFromInventory);
router.post("/updateInventory",authMiddleware,updateInventory);




export default router;