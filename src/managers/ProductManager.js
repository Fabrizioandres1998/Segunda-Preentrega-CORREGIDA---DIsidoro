import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // En caso de error, retornar un array vacío
        }
    }

    async getProductsById(productId) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw new Error("No se pudo obtener el producto");
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { ...product, id: newId };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error("Error al añadir el producto:", error);
            throw new Error(`Error al añadir el producto: ${error.message}`);
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct, id: productId };
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            } else {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                const [deletedProduct] = products.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                return deletedProduct;
            } else {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export const productManager = new ProductManager(
    path.resolve(__dirname, "./data/products.json")
);
