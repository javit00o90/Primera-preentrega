const express = require('express');
const app = express();
const port = 8080;
const productsRouter = require('./routes/products-router');
const cartRouter = require('./routes/carts-router');

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Página no encontrada" });
});

app.listen(port, () => {
    console.log(`Servidor encendido y escuchando el puerto ${port}`);
});