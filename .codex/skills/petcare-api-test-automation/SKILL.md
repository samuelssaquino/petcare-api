---
name: petcare-api-test-automation
description: Use esta skill para automatizar casos de teste da PetCare API a partir de documentos .docx, validando Swagger/OpenAPI e criando specs JavaScript com Mocha, Chai e Supertest que executam contra BASE_URL local ou Vercel.
---

# PetCare API Test Automation

## Objetivo

Automatizar casos de teste da PetCare API mantendo rastreabilidade entre documentos `.docx`, Swagger/OpenAPI e specs executáveis de API.

## Quando Usar

Use quando for necessário criar ou atualizar testes automatizados para user stories da PetCare API, especialmente quando houver casos documentais em `qa/test-cases/<story-id>/` e endpoints definidos no Swagger.

## Entradas Necessárias

- User story e condição de teste de origem.
- Pasta dos casos documentais `.docx`.
- Endpoint real e camada esperada.
- Arquivo Swagger/OpenAPI do projeto, normalmente `swagger/swagger.yaml`.
- Ambiente alvo via `BASE_URL`.

## Leitura dos Casos Documentais

1. Ler todos os `.docx` da pasta informada, ignorando arquivos temporários iniciados por `~$`.
2. Extrair `ID`, `Título`, `Rastreabilidade`, `Pré-Condições`, `Passos`, `Ação`, `Resultados Esperados` e `Pós-Condições`.
3. Identificar o objetivo de cada caso a partir do título, passos e resultados esperados.
4. Manter o ID do caso documental no nome ou descrição do teste automatizado.

## Validação do Swagger

1. Abrir `swagger/swagger.yaml`.
2. Confirmar que o endpoint real existe no bloco `paths`.
3. Confirmar método, rota, request body, campos obrigatórios, status code de sucesso e respostas documentadas.
4. Comparar Swagger, código e casos documentais antes de automatizar.
5. Se houver divergência, informar a divergência claramente e pedir aprovação antes de alterar Swagger, código ou contrato.

## Padrão dos Testes

- Usar JavaScript com Mocha, Chai e Supertest.
- Criar specs em `tests/api/<recurso>/<operacao>.spec.js`.
- Nomear arquivos em inglês técnico simples, por exemplo `register-user.spec.js`.
- Usar `describe` para user story e endpoint.
- Usar `it` com o ID documental no começo da descrição.
- Não alterar regra de negócio nem endpoints para fazer testes passarem.

## BASE_URL Obrigatório

Todo teste de API deve executar contra `process.env.BASE_URL`.

Exemplos:

```bash
BASE_URL=http://localhost:3000 npm run test:api
BASE_URL=https://petcare-api-seven.vercel.app npm run test:api
```

Em Windows/npm scripts, usar:

```bash
npm run test:api:local
npm run test:api:vercel
```

## Massa Dinâmica

- Gerar dados únicos por execução, principalmente e-mail.
- Evitar dependência entre testes.
- Evitar reaproveitar e-mails fixos dos documentos quando a API possui validação de duplicidade.
- Preservar o objetivo do caso documental mesmo usando dados dinâmicos.

## Validações Mínimas

Para cadastro de usuário em `POST /api/users`, validar no mínimo:

- Status code de sucesso documentado, normalmente `201`.
- Resposta é um objeto.
- Campo público `id` existe e não está vazio.
- Campos públicos esperados, como `name` e `email`.
- Normalizações esperadas quando o caso cobrir esse comportamento.
- Campos sensíveis não aparecem na resposta, especialmente `password` e `passwordHash`.

## Execução

Local:

```bash
npm run test:api:local
```

Vercel:

```bash
npm run test:api:vercel
```

Com URL customizada:

```bash
BASE_URL=<url-do-ambiente> npm run test:api
```

## Regras de Segurança do Repositório

- Não fazer commit sem aprovação explícita.
- Não fazer push sem aprovação explícita.
- Não alterar Swagger automaticamente quando houver divergência; pedir aprovação primeiro.
- Não alterar regra de negócio da API para acomodar testes.
