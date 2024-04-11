import {Router} from 'express';
import {display} from "../Controllers/medicine.controller.js"
const router = Router();




router.get('/home',display);


export default router;