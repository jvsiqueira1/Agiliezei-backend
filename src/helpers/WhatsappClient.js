const axios = require('axios');
const { formatarTelefone } = require('../helpers/Utils');

const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;

class WhatsappClient {
  async enviarMensagem(telefone, mensagem) {
    const phone = formatarTelefone(telefone);
    try {
      const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;

      const response = await axios.post(
        url,
        {
          phone,
          message: mensagem,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Client-Token': ZAPI_CLIENT_TOKEN,
          },
        },
      );

      console.log('STATUS ZAPI:', response.status);
      console.log('RESPOSTA ZAPI:', response.data);

      return { sucesso: true };
    } catch (error) {
      console.error(
        'Erro ao enviar mensagem:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao enviar mensagem via WhatsApp');
    }
  }
}

module.exports = new WhatsappClient();
