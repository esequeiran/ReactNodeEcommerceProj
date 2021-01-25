const express = require('express');
const router = express.Router();
const { isAuth, requireSignin, isAdmin } = require("../controllers/auth");
const {userById, addOrderToUserHistory} = require('../controllers/user')
const {create, listOrders, getStatusValues, orderById, updateOrderStatus} = require('../controllers/order')
const {decreaseQuantity} = require('../controllers/product')

router.post('/order/:userId', 
requireSignin, 
isAuth, 
addOrderToUserHistory, 
decreaseQuantity,
create)

router.get('/order/:userId', requireSignin, isAuth, isAdmin, listOrders);
router.get('/order/status/:userId', requireSignin, isAuth, isAdmin, getStatusValues);
router.put('/order/status/:orderId/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router;
