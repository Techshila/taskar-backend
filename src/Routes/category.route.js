import {Router} from 'express';
import { addCategory, deleteCategory, fetchCategory } from '../Controllers/category.controller.js';
import authMiddleware from '../Middlewares/auth.middleware.js';
import { multerUpload } from '../Middlewares/multer.middleware.js';

const router = Router();    

router.get('/fetch',fetchCategory);
router.get('/delete/:id',authMiddleware,deleteCategory);

router.post('/add',multerUpload.single("image"),authMiddleware,addCategory);

export default router;