const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const authenticateToken = require('../config/validation')

router.post('/store', authenticateToken, orderController.store);
router.post('/update/:order_id', authenticateToken, orderController.update);
router.get('/list', authenticateToken, orderController.listingOrders);
router.get('/order_by/:status', authenticateToken, orderController.getOrderByStatus);
router.delete('/remove/:order_id', authenticateToken, orderController.delete);
router.get('/get_recent_order', authenticateToken, orderController.getRecentOrders);
router.get('/get_all_order_count', authenticateToken, orderController.getAllOrderCount);
router.get('/get_pending_order_count', authenticateToken, orderController.getPendingOrderCount);
router.get('/get_in_progress_order_count', authenticateToken, orderController.getInProgressOrderCount);
router.get('/get_delivered_order_count', authenticateToken, orderController.getDeliveredOrderCount);
router.get('/get_cancelled_order_count', authenticateToken, orderController.getCancelledOrderCount);

module.exports = router;

