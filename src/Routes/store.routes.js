import {Router} from "express";
import { getNearestStore ,registerStore,verifyStore,storeManagerLogin } from "../Controllers/store.controller.js";
import authMiddleware from "../Middlewares/auth.middleware.js";
import { multerUpload } from "../Middlewares/multer.middleware.js";
const router = Router();

router.get("/getNearestStore",getNearestStore) ;

router.post("/registerStore",authMiddleware,registerStore);
router.post("/verifyStore",authMiddleware,verifyStore);
router.post("/storeManagerLogin",multerUpload.none(),storeManagerLogin);





export default router;