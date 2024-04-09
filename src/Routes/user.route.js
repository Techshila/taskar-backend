import {Router} from 'express';

const router = Router();

const userController = require('../Controllers/user.controller');

router.get('/cartshow',cartController.show);
router.get('/add/:idx',cartController.addqty);
router.get('/subtract/:idx',cartController.subtractqty);
router.get('/del/:idx',cartController.del);

router.post('./createreview',userController.createreview);

module.exports = router;