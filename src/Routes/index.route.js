import {Router} from 'express';
import medicineController from "../Controllers/medicine.controller.js"
const router = Router();




router.get('/home',medicineController.display);


export default router;