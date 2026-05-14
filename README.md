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

Rodar testes automatizados de API:

```bash
npm run test:api:local
```

## Documentacao

Com a API em execucao, acesse:

```text
http://localhost:3000/api-docs
```

## Deploy na Vercel

Variaveis necessarias no projeto da Vercel:

```text
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
BASE_URL=https://petcare-api-seven.vercel.app
```

Use uma `MONGODB_URI` do MongoDB Atlas para o deploy online. Para testar no Postman, use a base URL da Vercel e os mesmos endpoints da API, por exemplo:

```text
POST https://petcare-api-seven.vercel.app/api/users
```

## CI

A CI do GitHub Actions roda em pull requests para a branch `main` e tambem pode ser executada manualmente. O workflow sobe um MongoDB temporario via service container, inicia a API em background, aguarda `/health` ficar disponivel e executa os testes automatizados de API.

## Endpoints iniciais

- `GET /health`
- `POST /api/users`
- `POST /api/login`
- `POST /api/pets`
- `GET /api/pets`
- `GET /api/pets/:petId`

