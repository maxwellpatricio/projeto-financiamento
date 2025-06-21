# Projeto Simulação de Financiamento Estudantil

Backend desenvolvido em Node.js com TypeScript para simulações de financiamento estudantil.
O projeto, como solicitado, esta divido em back-end e front-end.
É necessario instalar as dependencias de cada um separadamente.
O back-end esta apontado para a porta 3000. O front-end está apontando todos os envios para localhost:3000.

# BACK-END
## 📦 Instalação/Execução Back-end

1. Instale as dependências:
    - npm install


2. Configure as variáveis de ambiente:
    - .env

3. Inicie o banco de dados:
    - docker-compose up -d


4. Configure o banco de dados:
    - npm run db:generate
    - npm run db:push

5. Inicie o servidor:
    - npm run dev

## 🔗 Endpoints

### Estudantes

- `POST /api/register` - Criar novo estudante
- `POST /api/login` - Autenticação
- `GET /api/me` - Dados do estudante autenticado
- `PUT /api/me` - Atualizar dados do estudante

### Simulações (Requer autenticação)

- `POST /api/simulations` - Criar nova simulação
- `GET /api/simulations` - Listar simulações do estudante

## 📊 Estrutura do Projeto

src/
├── controllers/     # Controladores
├── services/        # Lógica de negócio
├── middlewares/     # Middlewares
├── routes/          # Definição de rotas
├── validations/     # Schemas de validação
├── utils/           # Utilitários
├── types/           # Tipos TypeScript
└── server.ts        # Servidor principal

# FRONT-END
## 📦 Instalação/Execução Front-end

1. Instale as dependências:
    - npm install

2. Inicie o front-end:
    - npm run dev

## 📊 Estrutura do Projeto

src/
├── app/            # Paginas do portal
├── components/     # Componentes utilizados
├── contexts/       # Contextos de envio para API
├── hooks/          # Hooks utilizados
├── types/          # Tipagem dos objetos