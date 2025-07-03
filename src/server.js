const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const routes = require('./routes');

const app = express();

const PASTA_FOTOS_PERSISTENTES = '/uploads'

// Middlewares
app.use(cors({
  origin: ['https://agilizei-front-end.vercel.app', 'http://localhost:5173', 'https://www.agilizei.net', 'https://agilizei-front-end-nine.vercel.app'],
  credentials: true,
}));
app.use(express.json());

app.use('/api', routes);
app.use('/uploads', express.static(PASTA_FOTOS_PERSISTENTES));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`[CONFIG] Disco Persistente montado em: ${PASTA_FOTOS_PERSISTENTES}`);
  console.log(`[CONFIG] Fotos serão salvas e servidas diretamente deste caminho.`);
  console.log(`[CONFIG] URL de acesso às fotos: /uploads/nome_do_arquivo.jpg`);
});
