const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
