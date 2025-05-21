const formatarTelefone = (telefone) => {
  return '55' + telefone.replace(/\D/g, '');
};
module.exports = { formatarTelefone };
