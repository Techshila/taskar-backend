import {Router} from 'express';

const router = Router();

const userController = require('../Controllers/user.controller');

router.get('/cartshow',cartController.show);

router.post('./createreview',userController.createreview);

module.exports = router;