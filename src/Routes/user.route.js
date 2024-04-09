import {Router} from 'express';

const router = Router();

const userController = require('../Controllers/user.controller');
const cartController = require('../Controllers/cart.controller');

router.get('/cart/',cartController.add);
router.get('/cartshow',cartController.show);
router.get('/add/:idx',cartController.addqty);
router.get('/subtract/:idx',cartController.subtractqty);
router.get('/del/:idx',cartController.del);

router.post('./createreview',userController.createreview);

module.exports = router;