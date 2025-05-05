# Backend Agilizei - Sistema de Prestação de Serviços

API REST para gerenciamento de prestação de serviços, desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 12 ou superior)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Configuração do Banco de Dados

1. Instale o PostgreSQL
2. Crie um novo banco de dados:

```sql
CREATE DATABASE agilizei;
```

## Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITORIO]
cd backend-agilizei
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Copie o conteúdo do `.env.example`
   - Atualize as variáveis com suas configurações:

```env
PORT=3000
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/agilizei?schema=public"
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. Gere o Prisma Client:

```bash
npx prisma generate
```

## Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

### Produção

```bash
npm start
```

## Estrutura do Projeto

- `src/` - Código fonte
  - `server.js` - Arquivo principal do servidor

├── controllers/ # Controladores da aplicação
├── services/ # Lógica de negócios
├── routes/ # Definição das rotas
├── config/ # Configurações (Prisma, etc)
├── helpers/ # Funções auxiliares
└── server.js # Arquivo principal

## Banco de Dados

### Modelos

- **Cliente**: Usuários que solicitam serviços
- **Profissional**: Prestadores de serviços
- **Serviço**: Ordens de serviço
- **Orçamento**: Propostas de preço para serviços
- **TipoServico**: Categorias de serviços disponíveis
- **Endereco**: Endereços dos clientes
- **Admin**: Administradores do sistema

### Visualizando o Banco

Para visualizar os dados usando o Prisma Studio:

```bash
npx prisma studio
```

Acesse em: `http://localhost:5555`

## Endpoints da API

### Tipos de Serviço

- `POST /api/tipos-servico`: Criar tipo de serviço
- `GET /api/tipos-servico`: Listar todos
- `GET /api/tipos-servico/:id`: Buscar por ID
- `PUT /api/tipos-servico/:id`: Atualizar
- `DELETE /api/tipos-servico/:id`: Deletar

### Clientes

- `POST /api/clientes`: Criar cliente
- `GET /api/clientes`: Listar todos
- `GET /api/clientes/:id`: Buscar por ID
- `GET /api/clientes/telefone/:telefone`: Buscar por telefone
- `PUT /api/clientes/:id`: Atualizar
- `DELETE /api/clientes/:id`: Deletar

### Profissionais

- `POST /api/profissionais`: Criar profissional
- `GET /api/profissionais`: Listar todos
- `GET /api/profissionais/:id`: Buscar por ID
- `GET /api/profissionais/tipo/:tipoServicoId`: Buscar por tipo de serviço
- `PUT /api/profissionais/:id`: Atualizar
- `DELETE /api/profissionais/:id`: Deletar

### Serviços

- `POST /api/servicos`: Criar serviço
- `GET /api/servicos`: Listar todos
- `GET /api/servicos/:id`: Buscar por ID
- `GET /api/servicos/cliente/:clienteId`: Listar por cliente
- `PUT /api/servicos/:id`: Atualizar
- `PUT /api/servicos/:id/escolher-orcamento`: Escolher orçamento
- `DELETE /api/servicos/:id`: Deletar

### Orçamentos

- `POST /api/orcamentos`: Criar orçamento
- `GET /api/orcamentos`: Listar todos
- `GET /api/orcamentos/:id`: Buscar por ID
- `GET /api/orcamentos/servico/:servicoId`: Listar por serviço
- `PUT /api/orcamentos/:id`: Atualizar
- `DELETE /api/orcamentos/:id`: Deletar

## Exemplos de Requisições

### Criar Tipo de Serviço

```json
POST /api/tipos-servico
{
    "nome": "Eletricista",
    "descricao": "Serviços de instalação e manutenção elétrica"
}
```

### Criar Cliente

```json
POST /api/clientes
{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "cpf": "12345678900",
    "enderecos": {
        "create": {
            "rua": "Rua das Flores",
            "numero": "123",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01001000"
        }
    }
}
```

### Criar Serviço

```json
POST /api/servicos
{
    "titulo": "Reparo Elétrico",
    "descricao": "Problema na fiação",
    "tipoServicoId": 1,
    "status": "PENDENTE",
    "clienteId": 1,
    "dataAgendada": "2024-03-25T14:30:00.000Z"
}
```

## Testando a API

1. Importe a collection do Postman disponível em `docs/postman/backend-agilizei.json`
2. Configure a variável de ambiente `baseUrl` no Postman para `http://localhost:3000/api`
3. Siga o fluxo de testes:
   - Criar tipo de serviço
   - Criar cliente
   - Criar profissional
   - Criar serviço
   - Criar orçamentos
   - Escolher orçamento

## Suporte

Em caso de dúvidas ou problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme as configurações do banco de dados
3. Verifique os logs de erro no console
4. Entre em contato com a equipe de desenvolvimento
