const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {upload} = require('../config/cloudinaryConfig');


router.post('/products', upload.single('image'), productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;