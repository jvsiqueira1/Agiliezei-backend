const checkUserTypeMiddleware = (allowedTypes) => {
  return (req, res, next) => {
    try {
      const { tipo } = req.usuario;

      if (!allowedTypes.includes(tipo)) {
        return res.status(403).json({
          error: "Acesso negado. Tipo de usuário não autorizado.",
        });
      }

      return next();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao verificar tipo de usuário" });
    }
  };
};

module.exports = checkUserTypeMiddleware;
