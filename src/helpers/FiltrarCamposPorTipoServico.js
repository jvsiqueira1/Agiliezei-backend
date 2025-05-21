function filtrarCamposPorTipoServico(servico) {
  const base = {
    id: servico.id,
    descricao: servico.descricao,
    tipoServicoId: servico.tipoServicoId,
    status: servico.status,
    dataAgendada: servico.dataAgendada,
    orcamentos: servico.orcamentos,
    createdAt: servico.createdAt,
    updatedAt: servico.updatedAt,
  };

  switch (servico.tipoServicoId) {
    case 1: // Faxineira
      return {
        ...base,
        tipoLimpeza: servico.tipoLimpeza,
        tamanhoImovel: servico.tamanhoImovel,
        frequencia: servico.frequencia,
        horario: servico.horario,
        extras: servico.extras,
      };
    case 2: // Eletricista
      return {
        ...base,
        tipoServicoEletrico: servico.tipoServicoEletrico,
        descricaoProblema: servico.descricaoProblema,
      };
    case 3: // Pintor
      return {
        ...base,
        tipoImovel: servico.tipoImovel,
        superficie: servico.superficie,
        condicao: servico.condicao,
        prazo: servico.prazo,
      };
    case 4: // Montador de Móveis
      return {
        ...base,
        descricaoMoveis: servico.descricaoMoveis,
        quantidadeMoveis: servico.quantidadeMoveis,
      };
    case 5: // Jardineiro
      return {
        ...base,
      };
    case 6: // Freteiro
      return {
        ...base,
        descricaoItens: servico.descricaoItens,
        origemDestino: servico.origemDestino,
      };
    case 7: // Pedreiro
      return {
        ...base,
        descricaoServicoPedreiro: servico.descricaoServicoPedreiro,
        areaMetragem: servico.areaMetragem,
      };
    default:
      return base;
  }
}

module.exports = filtrarCamposPorTipoServico;
