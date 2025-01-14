const { Router } = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = Router();
const productsPath = path.join(__dirname, '../data/productos.json'); // Ruta a productos.json

// Función para obtener productos
const getProducts = async () => {
  try {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer los productos:', error);
    return [];
  }
};

// Función para guardar productos
const saveProducts = async (products) => {
  try {
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al guardar los productos:', error);
  }
};

// Ruta raíz: Obtener todos los productos (con opción ?limit)
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    const limit = parseInt(req.query.limit);

    if (limit && !isNaN(limit)) {
      return res.json(products.slice(0, limit));
    }
    res.json(products);
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const products = await getProducts();
    const product = products.find((p) => p.id === parseInt(req.params.pid));

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const products = await getProducts();
    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    products.push(newProduct);
    await saveProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send('Error al crear el producto');
  }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(req.params.pid));

    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }

    products.splice(productIndex, 1);
    await saveProducts(products);

    res.status(200).send('Producto eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;
