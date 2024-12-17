const express = require("express");
const fs = require("fs");
const router = express.Router();

// Archivo donde se guardan los carritos
const cartsFile = "data/carrito.json";

// Función para leer carritos del archivo
const getCarts = () => {
    const data = fs.readFileSync(cartsFile, "utf-8");
    return JSON.parse(data);
};

// Función para escribir carritos en el archivo
const saveCarts = (carts) => {
    fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
};

// Ruta GET: Obtener productos de un carrito por ID
router.get("/:cid", (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
});

// Ruta POST: Agregar un producto a un carrito
router.post("/:cid/product/:pid", (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const { pid } = req.params;
    const existingProduct = cart.products.find(p => p.product === parseInt(pid));

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({
            product: parseInt(pid),
            quantity: 1
        });
    }

    saveCarts(carts);
    res.json(cart);
});

module.exports = router;
