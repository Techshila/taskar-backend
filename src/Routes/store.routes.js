import {Router} from "express";
import { getNearestStore ,registerStore,verifyStore,storeManagerLogin, addToInventory, deleteFromInventory, updateInventory, fetchVerifiedStore, fetchUnVerifiedStore ,fetchCompletedOrders} from "../Controllers/store.controller.js";
import authMiddleware from "../Middlewares/auth.middleware.js";
import { multerUpload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.get("/getNearestStore",getNearestStore) ;
router.get("/fetchverified",authMiddleware,fetchVerifiedStore);
router.get("/fetchunverified",authMiddleware,fetchUnVerifiedStore);

router.post("/registerStore",authMiddleware,registerStore);
router.post("/verifyStore",authMiddleware,verifyStore);
router.post("/storeManagerLogin",multerUpload.none(),storeManagerLogin);

router.post("/addInventory",authMiddleware,addToInventory);
router.post("/deleteInventory",authMiddleware,deleteFromInventory);
router.post("/updateInventory",authMiddleware,updateInventory);

router.post("/fetchCompletedOrders",fetchCompletedOrders);


export default router;