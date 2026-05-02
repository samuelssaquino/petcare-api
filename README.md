# petcare-api

API Rest em JavaScript com Express, autenticacao JWT e conexao com MongoDB.

## Funcionalidades iniciais

- Registrar usuario
- Logar usuario
- Cadastrar PET
- Apresentar PET

## Tecnologias

- Node.js
- Express
- MongoDB com Mongoose
- JWT
- Swagger

## Estrutura

```text
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  app.js
  server.js
swagger/
  swagger.yaml
```

## Configuracao

Crie um arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variaveis principais:

```text
PORT=3000
BASE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/petcare-api
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
```

## Scripts

Instalar dependencias:

```bash
npm install
```

Iniciar a API em modo estatico:

```bash
npm start
```

Iniciar a API em modo desenvolvimento, reiniciando ao alterar arquivos:

```bash
npm run dev
```

Rodar testes unitarios:

```bash
npm test
```

## Documentacao

Com a API em execucao, acesse:

```text
http://localhost:3000/api-docs
```

## Endpoints iniciais

- `GET /health`
- `POST /api/users`
- `POST /api/login`
- `POST /api/pets`
- `GET /api/pets`

