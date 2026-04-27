# Consulta Segura

Aplicacao fullstack para consulta autenticada de registros simulados de pessoas, com score de confianca, fonte informada e log de auditoria.

O projeto esta separado em `backend` e `frontend`, pronto para GitHub. O backend pode ser conectado manualmente ao Railway depois e o frontend pode ser conectado manualmente ao Vercel depois. Nenhum deploy automatico foi configurado.

> O seed local usa dados ficticios e mascarados. A arquitetura esta pronta para conectar APIs oficiais/autorizadas no futuro, mas nao implementa scraping, bases nao autorizadas nem enriquecimento de dados pessoais reais.

## Estrutura

```txt
/backend
/frontend
README.md
```

## Backend

Stack: Node.js, Express, PostgreSQL, Prisma ORM, CORS, dotenv, Zod, JWT, bcryptjs, helmet e express-rate-limit.

### Rodar backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

`.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/consulta_segura?schema=public"
JWT_SECRET="troque-por-um-segredo-com-pelo-menos-16-caracteres"
PORT=3000
FRONTEND_URL=http://localhost:5173
DATA_PROVIDER_MODE=simulated
AUTHORIZED_PROVIDER_URL=
AUTHORIZED_PROVIDER_API_KEY=
```

## Frontend

Stack: React, Vite, TypeScript, Axios, React Router e CSS simples.

### Rodar frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Login demo

- Email: `admin@demo.com`
- Senha: `123456`

## Rotas

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /people/search` com token Bearer
- `GET /audit/searches` com token de `ADMIN` ou `AUDITOR`

## Fontes de dados

O backend usa um contrato de provider em `backend/src/providers`.

- `DATA_PROVIDER_MODE=simulated`: usa a tabela `Person` com dados ficticios/mascarados.
- `DATA_PROVIDER_MODE=authorized_api`: conecta uma API oficial/autorizada via HTTP.

Quando `DATA_PROVIDER_MODE=authorized_api`, o backend envia `POST` para `AUTHORIZED_PROVIDER_URL` com:

```json
{
  "name": "Joao Silva",
  "city": "Sao Paulo"
}
```

Headers:

```txt
Authorization: Bearer AUTHORIZED_PROVIDER_API_KEY
Content-Type: application/json
```

Resposta esperada:

```json
{
  "matches": [
    {
      "id": "fonte-123",
      "fullName": "Joao da Silva",
      "city": "Sao Paulo",
      "state": "SP",
      "company": "Orgao autorizado",
      "role": "Servidor",
      "documentMasked": "***.123.456-**",
      "emailMasked": "joao.s****@dominio.gov.br",
      "phoneMasked": "(11) 9****-1234",
      "motherName": "Nome autorizado ou mascarado",
      "fatherName": "Nome autorizado ou mascarado",
      "sourceName": "Fonte Oficial Autorizada",
      "confidenceScore": 88
    }
  ]
}
```

A fonte real precisa ter autorizacao formal, base legal, contrato de uso, controle de acesso, retencao definida, auditoria e limites de consulta. Fontes nao autorizadas, scraping de dados pessoais e bases vazadas nao devem ser integradas.

## Railway

1. Conecte o repositorio no Railway.
2. Defina o diretorio do servico como `backend`.
3. Configure `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `DATA_PROVIDER_MODE`, `AUTHORIZED_PROVIDER_URL` e `AUTHORIZED_PROVIDER_API_KEY` se usar provider autorizado.
4. Rode migrations e seed quando aplicavel.

## Vercel

1. Conecte o repositorio no Vercel.
2. Defina o diretorio do projeto como `frontend`.
3. Configure `VITE_API_URL` com a URL do backend no Railway.
4. Build: `npm run build`.
5. Output: `dist`.

## Seguranca

- Nenhum segredo hardcoded.
- Senhas com hash bcryptjs.
- JWT via variavel externa.
- CORS limitado por `FRONTEND_URL`.
- Helmet e rate limit ativos.
- Consultas exigem finalidade e geram auditoria.
- Seed usa dados ficticios e mascarados.
- Nao use scraping de dados pessoais nem fontes nao autorizadas.
