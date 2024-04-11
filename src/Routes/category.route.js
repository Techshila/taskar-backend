import {Router} from 'express';

const router = Router();    

router.post('/add',multerUpload.single("image"), addCategory);