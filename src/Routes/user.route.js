import {Router} from 'express';
import cartController from '../Controllers/cart.controller.js';
import { createreview,registerUser,loginUser } from '../Controllers/user.controller.js';
import authMiddleware from '../Middlewares/auth.middleware.js';
import { multerUpload } from "../Middlewares/multer.middleware.js";
const router = Router();



router.get('/cart/',authMiddleware,cartController.add);
router.get('/cartshow',authMiddleware,cartController.show);
router.get('/add/:idx',authMiddleware,cartController.addqty);
router.get('/subtract/:idx',authMiddleware,cartController.subtractqty);
router.get('/del/:idx',authMiddleware,cartController.del);

router.post('/createreview',createreview);
router.post("/registerUser",multerUpload.none(),registerUser);
router.get("/logInUser",multerUpload.none(),loginUser)

export default router;