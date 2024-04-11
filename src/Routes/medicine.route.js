import {Router} from 'express'; 
import {addMedicine,fetchMedicineByCategory} from '../Controllers/medicine.controller.js';
import { multerUpload } from '../Middlewares/multer.middleware.js';

const router = Router();    


router.post('/add',multerUpload.array("displayImages",7), addMedicine);
router.post("/category",fetchMedicineByCategory);
export default router;