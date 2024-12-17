const express = require("express");
const fs = require("fs");
const router = express.Router();


const cartsFile = "data/carrito.json";


const getCarts = () => {
    const data = fs.readFileSync(cartsFile, "utf-8");
    return JSON.parse(data);
};


const saveCarts = (carts) => {
    fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
};


router.get("/:cid", (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
});


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
