const fs = require('fs').promises;
const path = require('path');

class CartsManager {
    constructor() {
        this.filePath = path.join(__dirname, '..', 'files', 'carts.json');
    }

    async initializeCartFile() {
        const defaultData = [];
        await this.saveCartsToJSON(defaultData);
    }

    async createCart() {
        try {
            let data;
            let carts = [];
            try {
                data = await fs.readFile(this.filePath, 'utf8');
                carts = JSON.parse(data);
            } catch (error) {
                await this.initializeCartFile();
                data = await fs.readFile(this.filePath, 'utf8');
                carts = JSON.parse(data);
            }
            const cartIdCounter = Math.max(...carts.map(cart => cart.id), 0) + 1;
            const newCart = {
                id: cartIdCounter,
                products: [],
            };
            carts.push(newCart);
            await this.saveCartsToJSON(carts);
            return newCart;
        } catch (error) {
            console.error('Error creando carrito:', error.message);
            return null;
        }
    }

    async getCartById(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            const products = await Promise.all(cart.products.map(async product => {
                const productData = await fs.readFile(path.join(__dirname, '..', 'files', 'products.json'), 'utf8');
                const products = JSON.parse(productData);
                const productObj = products.find(p => p.id === product.id);
                return { ...product, ...productObj };
            }));
            return { ...cart, products };
        } else {
            return "Carrito no encontrado.";
        }
    }

    async saveCartsToJSON(carts) {
        try {
            const data = JSON.stringify(carts, null, 2);
            await fs.writeFile(this.filePath, data);
        } catch (error) {
            console.error('Error guardando carrito al JSON:', error.message);
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (!data) {
                await this.saveCartsToJSON([]);
                return [];
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer carrito desde JSON:', error.message);
            return [];
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            let data;
            let carts = [];
            try {
                data = await fs.readFile(this.filePath, 'utf8');
                carts = JSON.parse(data);
            } catch (error) {
                await this.initializeCartFile();
                data = await fs.readFile(this.filePath, 'utf8');
                carts = JSON.parse(data);
            }
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                return "Carrito no encontrado.";
            }
            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                cart.products.push({ id: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }
            await this.saveCartsToJSON(carts);
            return "Producto agregado al carrito correctamente.";
        } catch (error) {
            console.error('Error agregando producto al carrito:', error.message);
            return "Error agregando producto al carrito.";
        }
    }
}

module.exports = CartsManager;