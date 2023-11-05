const express = require('express');
const router = express.Router();
const ProductManager = require('../classes/productManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json(product);
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const result = await productManager.deleteProduct(productId);
    res.json({ message: result });
});

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;
    const productData = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
    };
    const result = await productManager.addProductRawJSON(JSON.stringify(productData));
    res.json({ message: result });
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updates = req.body;
    const result = await productManager.updateProduct(productId, updates);
    res.json({ message: result });
});


module.exports = router;