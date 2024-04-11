import {Router} from 'express';
import cartController from '../Controllers/cart.controller.js';
import { createreview,registerUser,loginUser,updateUser,updateUserAvatar,logOut } from '../Controllers/user.controller.js';
import authMiddleware from '../Middlewares/auth.middleware.js';
import { multerUpload } from "../Middlewares/multer.middleware.js";
import { search } from '../Controllers/search.controller.js';
const router = Router();



router.get('/cart/',authMiddleware,cartController.add);
router.get('/cartshow',authMiddleware,cartController.show);
router.get('/cart/add/:idx',authMiddleware,cartController.addqty);
router.get('/cart/subtract/:idx',authMiddleware,cartController.subtractqty);
router.get('/cart/del/:idx',authMiddleware,cartController.del);
router.get('/search/:id',search);


router.post('/createreview/:id',authMiddleware,createreview);
router.post("/registerUser",multerUpload.none(),registerUser);
router.get("/logInUser",multerUpload.none(),loginUser)
router.post("/updateUser",authMiddleware,multerUpload.none(),updateUser);
router.post("/updateUserAvatar",authMiddleware,multerUpload.single("avatar"),updateUserAvatar);
router.post("/logOut",authMiddleware,logOut);
export default router;