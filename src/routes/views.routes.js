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
    // res.send("lista de productos")
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
});


export default router;
