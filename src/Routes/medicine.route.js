import {Router} from 'express'; 
import {addMedicine} from '../Controllers/medicine.controller.js';
import { multerUpload } from '../Middlewares/multer.middleware.js';

const router = Router();    


router.post('/add',multerUpload.array("displayImages",7), addMedicine);

export default router;