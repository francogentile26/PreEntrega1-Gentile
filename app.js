const express = require('express');
const { engine } = require('express-handlebars');  // Aquí es donde cambiamos a "engine"
const productsRouter = require('./routes/products.router'); // Ruta correcta para los productos

const app = express();

// Middleware para procesar JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', engine());  // Usamos "engine()" ahora en lugar de handlebars()
app.set('view engine', 'handlebars');

// Ruta para los productos
app.use('/api/products', productsRouter);

// Ruta para la vista principal (por ejemplo, home)
app.get('/', (req, res) => {
  res.render('home'); // Asegúrate de tener la vista home.handlebars
});

// Puerto del servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



