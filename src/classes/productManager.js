const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '..', 'files', 'products.json');
    }

    async addProductRawJSON(rawJSON) {
        try {
            let data;
            let products = [];
            try {
                data = await fs.readFile(this.filePath, 'utf8');
                products = JSON.parse(data);
            } catch (error) {
                await this.initializeProductFile();
                data = await fs.readFile(this.filePath, 'utf8');
                products = JSON.parse(data);
            }
            const { title, description, price, thumbnail, code, stock, category = '', status = true } = JSON.parse(rawJSON);
            const existingProduct = products.find(product => product.code === code);
            if (existingProduct) {
                return "Ya existe un producto con ese código.";
            }
            const productIdCounter = Math.max(...products.map(product => product.id), 0) + 1;
            const newProduct = {
                id: productIdCounter,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status,
            };
            products.push(newProduct);
            await this.saveProductsToJSON(products);
            return "Producto agregado correctamente.";
        } catch (error) {
            console.error('Error agregando producto:', error.message);
            return "Error agregando producto.";
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (!data) {
                await this.saveProductsToJSON([]);
                return [];
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer producto desde JSON:', error.message);
            return [];
        }
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        const product = products.find(product => product.id === pid);
        if (product) {
            return product;
        } else {
            return "Producto no encontrado.";
        }
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return "Producto no encontrado.";
        }
        const product = products[productIndex];
        const updatedProduct = { ...product };
        for (const key in updates) {
            if (key in updatedProduct) {
                updatedProduct[key] = updates[key];
            }
        }
        products[productIndex] = updatedProduct;
        await this.saveProductsToJSON(products);
        return "Producto actualizado correctamente.";
    }

    async saveProductsToJSON(products) {
        try {
            const data = JSON.stringify(products, null, 2);
            await fs.writeFile(this.filePath, data);
        } catch (error) {
            console.error('Error guardando producto al JSON:', error.message);
        }
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === pid);
        if (productIndex === -1) {
            return "Producto no encontrado.";
        }
        setTimeout(async () => {
            products.splice(productIndex, 1);
            await this.saveProductsToJSON(products);
            console.log(`Producto con ID ${pid} eliminado.`);
        }, 2000);
        return "Eliminando producto...";
    }
}

module.exports = ProductManager;