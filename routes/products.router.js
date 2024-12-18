const express = require("express");
const fs = require("fs");
const router = express.Router();


const productsFile = "data/productos.json";


const getProducts = () => {
    const data = fs.readFileSync(productsFile, "utf-8");
    return JSON.parse(data);
};


const saveProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};


router.get("/", (req, res) => {
    const products = getProducts();
    const limit = req.query.limit;

    if (limit) {
        return res.json(products.slice(0, parseInt(limit)));
    }
    res.json(products);
});


router.get("/:pid", (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
});


router.post("/", (req, res) => {
    const products = getProducts();
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
});

module.exports = router;
