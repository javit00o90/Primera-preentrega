const express = require('express');
const router = express.Router();
const CartsManager = require('../classes/cartsManager');

const cartsManager = new CartsManager();

router.get('/', async (req, res) => {
    const carts = await cartsManager.getCarts();
    res.json(carts);
});

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = await cartsManager.getCartById(cartId);
    res.json(cart);
});

router.post('/', async (req, res) => {
    const cart = await cartsManager.createCart();
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const result = await cartsManager.addProductToCart(cartId, productId);
    res.json({ message: result });
});

module.exports = router;