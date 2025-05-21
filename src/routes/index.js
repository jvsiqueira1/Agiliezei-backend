const express = require('express');
const router = express.Router();

const clienteRoutes = require('./cliente.routes');
const profissionalRoutes = require('./profissional.routes');
const servicoRoutes = require('./servico.routes');
const orcamentoRoutes = require('./orcamento.routes');
const adminRoutes = require('./admin.routes');
const tipoServicoRoutes = require('./tipoServico.routes');
const authRoutes = require('./auth.routes');
const outrosServicosRoutes = require('./outrosServicos.routes');

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/servicos', servicoRoutes);
router.use('/orcamentos', orcamentoRoutes);
router.use('/admin', adminRoutes);
router.use('/tipos-servico', tipoServicoRoutes);
router.use('/outros-servicos', outrosServicosRoutes);

module.exports = router;
