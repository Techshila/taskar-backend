import {Router} from "express";
import authMiddleware from "../Middlewares/auth.middleware.js";
import { getAddresses,updateAddresses } from "../Controllers/address.controller.js";
const router = Router();

router.get("/",authMiddleware,getAddresses);
router.post("/updateAddress",authMiddleware,updateAddresses);

export default router;
