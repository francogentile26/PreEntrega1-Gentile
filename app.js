const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

// Middleware
app.use(express.json()); // Permite manejar JSON en las solicitudes

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

