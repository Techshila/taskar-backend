import {Router} from 'express';

const router = Router();

const medicineController = require('../Controllers/medicine.controller');

router.get('/home',medicineController.display);
router.use('/users',require('../Routes/user.route'));

module.exports = router;