# Backend - Sistema de Simulação de Financiamento Estudantil

Backend desenvolvido em Node.js com TypeScript para simulações de financiamento estudantil.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação (expiração de 5 minutos)
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de dados
- **Docker Compose** - Containerização do banco

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Inicie o banco de dados:
\`\`\`bash
docker-compose up -d
\`\`\`

5. Configure o banco de dados:
\`\`\`bash
npm run db:generate
npm run db:push
\`\`\`

6. Inicie o servidor:
\`\`\`bash
npm run dev
\`\`\`

## 🔗 Endpoints

### Estudantes

- `POST /api/register` - Criar novo estudante
- `POST /api/login` - Autenticação
- `GET /api/me` - Dados do estudante autenticado
- `PUT /api/me` - Atualizar dados do estudante

### Simulações (Requer autenticação)

- `POST /api/simulations` - Criar nova simulação
- `GET /api/simulations` - Listar simulações do estudante

### Outros

- `GET /health` - Health check

## 🧮 Fórmula de Cálculo

O sistema utiliza a fórmula Price para calcular as parcelas:

\`\`\`
PMT = PV * (i / (1 - (1 + i)^-n))
\`\`\`

Onde:
- PMT = parcela mensal
- PV = valor total do financiamento
- i = juros ao mês (decimal)
- n = número de parcelas

## 🔐 Autenticação

- JWT com expiração de 5 minutos
- Header: `Authorization: Bearer <token>`
- Senhas criptografadas com bcrypt (12 rounds)

## 📊 Estrutura do Projeto

\`\`\`
src/
├── controllers/     # Controladores
├── services/        # Lógica de negócio
├── middlewares/     # Middlewares
├── routes/          # Definição de rotas
├── validations/     # Schemas de validação
├── utils/           # Utilitários
├── types/           # Tipos TypeScript
└── server.ts        # Servidor principal
\`\`\`

## 🛡️ Segurança

- Validação de dados com Zod
- Senhas criptografadas
- JWT com expiração curta
- Tratamento de erros
- CORS configurado
- Rate limiting (recomendado para produção)

## 📝 Exemplos de Uso

### Registro
\`\`\`bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "sobrenome": "Silva",
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'
\`\`\`

### Criar Simulação
\`\`\`bash
curl -X POST http://localhost:3000/api/simulations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "valorTotal": 50000,
    "quantidadeParcelas": 24,
    "jurosAoMes": 0.02
  }'
