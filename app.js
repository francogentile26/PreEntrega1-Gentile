const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");


app.use(express.json()); 


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

