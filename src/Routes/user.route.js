import {Router} from 'express';

const router = Router();

const userController = require('../Controllers/user.controller');

router.post('./createreview',userController.createreview);

module.exports = router;