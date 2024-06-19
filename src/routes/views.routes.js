import { Router } from "express";
import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";

const router = Router();

router.get("/", (req, res) => {
    const productsFilePath = path.join(__dirname, "data", "products.json");

    fs.readFile(productsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo products.json", err);
            res.status(500).send("Error al leer los productos");
            return;
        }

        const products = JSON.parse(data);
        res.render("home", { products });
    });
});

export default router;
