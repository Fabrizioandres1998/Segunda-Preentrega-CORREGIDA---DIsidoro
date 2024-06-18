import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";
import Product from "../classes/Product.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductsById(Number(pid));
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const product = new Product(title, description, price, thumbnail, code, stock);
        const newProduct = await productManager.addProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo agregar el producto: ${error.message}` });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock, status } = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(Number(id), { title, description, price, thumbnail, code, stock, status });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo actualizar el producto: ${error.message}` });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productManager.deleteProduct(Number(id));
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo eliminar el producto: ${error.message}` });
    }
});

export default router;
