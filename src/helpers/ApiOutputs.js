class ApiOutputs {
  static success(data, message = 'Operação realizada com sucesso') {
    return {
      success: true,
      message,
      data,
    };
  }

  static created(data, message = 'Registro criado com sucesso') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'Erro ao processar a requisição', errors = null) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static notFound(message = 'Registro não encontrado') {
    return {
      success: false,
      message,
    };
  }

  static badRequest(message = 'Requisição inválida', errors = null) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static unauthorized(message = 'Não autorizado') {
    return {
      success: false,
      message,
    };
  }

  static noContent(message = null, success = false) {
    return {
      success,
      message,
    };
  }
}

module.exports = ApiOutputs;
