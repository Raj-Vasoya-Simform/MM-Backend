const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const authenticateToken = require('../config/validation')

router.post('/store', authenticateToken, productController.store);
router.post('/update/:product_id', authenticateToken, productController.update);
router.get('/list', authenticateToken, productController.listingProducts);
router.delete('/remove/:product_id', authenticateToken, productController.delete);

module.exports = router;

