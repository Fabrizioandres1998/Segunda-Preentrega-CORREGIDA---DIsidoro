import { Router } from "express";
import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";

const router = Router();
const productsFilePath = path.join(__dirname, "data", "products.json");

const readProducts = () => {
    return JSON.parse(fs.readFileSync(productsFilePath, "utf8"));
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

router.get("/", (req, res) => {
    const products = readProducts();
    res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
    const products = readProducts();
    res.render("realTimeProducts", { products });
});

router.post("/products", (req, res) => {
    const products = readProducts();
    const newProduct = req.body;

    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push(newProduct);
    writeProducts(products);

    req.io.emit("productAdded", newProduct);
    res.status(201).send(newProduct);
});

router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const product = new Product(title, description, price, thumbnail, code, stock);
        const newProduct = await productManager.addProduct(product);

// Emitir evento WebSocket para nuevo producto
        req.io.emit("productAdded", newProduct);

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

// Emitir evento WebSocket para producto actualizado
        req.io.emit("productUpdated", updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo actualizar el producto: ${error.message}` });
    }
});


router.delete("/products/:id", (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        console.log("Eliminando producto id:", productId)
        const products = readProducts();
        const newProducts = products.filter(product => product.id !== productId);

        writeProducts(newProducts);
        req.io.emit("productDeleted", productId);
        res.status(200).send({ id: productId });

    } catch (error) {
        console.log(error)
    }

    res.status(200).send({ id: productId });
});

export default router;
