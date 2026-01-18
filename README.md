# StockHome API

API backend para a aplicação StockHome, construída com Bun e Elysia, integrada com Supabase.

## Requisitos

- [Bun](https://bun.sh/) 1.0+
- [Supabase](https://supabase.com/) conta e projeto

## Instalação

1. Clone o repositório e acesse a pasta da API:

```bash
cd api
```

2. Copie o arquivo de ambiente e configure:

```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

4. Instale as dependências:

```bash
bun install
```

## Executar

### Desenvolvimento

```bash
bun run dev
```

A API estará disponível em `http://localhost:3000`

### Build

```bash
bun run build
```

### Produção

```bash
bun start
```

## Estrutura do Projeto

```
src/
├── controllers/          # Lógica de negócio
│   ├── items.controller.ts
│   ├── shopping-list.controller.ts
│   └── analytics.controller.ts
├── db/                   # Camada de banco de dados
│   ├── client.ts         # Cliente Supabase
│   ├── items.repository.ts
│   ├── shopping-list.repository.ts
│   └── users.repository.ts
├── middleware/           # Middlewares
│   └── auth.middleware.ts
├── routes/               # Rotas da API
│   ├── items.routes.ts
│   ├── shopping-list.routes.ts
│   ├── analytics.routes.ts
│   ├── health.routes.ts
│   └── index.ts
├── types/                # Tipos TypeScript
│   └── index.ts
├── utils/                # Utilitários
│   └── error-handler.ts
└── index.ts              # Entrada da aplicação
```

## Endpoints

### Health

- `GET /health` - Verifica status da API
- `GET /health/db` - Verifica conexão com banco de dados

### Items (Inventário)

- `GET /items` - Lista todos os itens (paginado)
- `GET /items/:id` - Obtém um item específico
- `GET /items/category/:category` - Lista itens por categoria
- `GET /items/low-stock` - Lista itens com baixo estoque
- `GET /items/expiring` - Lista itens vencendo em breve
- `POST /items` - Cria um novo item
- `PUT /items/:id` - Atualiza um item
- `DELETE /items/:id` - Deleta um item

### Shopping List

- `GET /shopping-list` - Lista todos os itens (paginado)
- `GET /shopping-list/incomplete` - Lista itens não marcados como completos
- `POST /shopping-list` - Adiciona um item à lista
- `PUT /shopping-list/:id` - Atualiza um item
- `PATCH /shopping-list/:id/toggle` - Marca como completo/incompleto
- `DELETE /shopping-list/:id` - Remove um item
- `DELETE /shopping-list/completed/clear` - Remove todos os itens completos

### Analytics

- `GET /analytics/inventory` - Análise completa do inventário
- `GET /analytics/dashboard` - Estatísticas do painel

## Autenticação

A API usa autenticação via token Bearer do Supabase. Inclua o token no header:

```
Authorization: Bearer seu-token-jwt
```

## Banco de Dados (Supabase)

### Schema obrigatório:

#### Tabela: `items`

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit VARCHAR(50),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  location VARCHAR(255),
  expiration_date DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: `shopping_list`

```sql
CREATE TABLE shopping_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit VARCHAR(50),
  is_completed BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Integração com Frontend

O frontend em React/Vite pode se conectar aos endpoints:

```typescript
const API_URL = "http://localhost:3000";

// Exemplo: Buscar itens
fetch(`${API_URL}/items`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Desenvolvimento

### Adicionar novo endpoint

1. Crie um controller em `src/controllers/`
2. Crie um repository em `src/db/` se precisar interagir com DB
3. Crie as rotas em `src/routes/`
4. Adicione os tipos em `src/types/index.ts`
5. Registre as rotas em `src/routes/index.ts`

### Type checking

```bash
bun run type-check
```

## Variáveis de Ambiente

- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anon do Supabase (para cliente)
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role (para admin)
- `NODE_ENV` - development ou production
- `PORT` - Porta da API (padrão: 3000)
- `API_URL` - URL base da API
- `CORS_ORIGIN` - Origem permitida para CORS

## Troubleshooting

### Erro de conexão com Supabase

- Verifique se as credenciais em `.env` estão corretas
- Confirme que o projeto Supabase está ativo
- Teste a conexão: `GET /health/db`

### CORS errors

- Atualize a variável `CORS_ORIGIN` em `.env` com a URL correta do frontend

### Problemas com tipagem

- Execute `bun run type-check` para validar tipos
- Verifique se os tipos em `src/types/index.ts` estão atualizados

## Performance

- A API implementa paginação para listas grandes
- Índices recomendados no Supabase:
  - `items.user_id`
  - `items.category`
  - `shopping_list.user_id`
  - `shopping_list.is_completed`

## Segurança

- Use variáveis de ambiente para credenciais sensíveis
- Configure RLS (Row Level Security) no Supabase para usuários
- Valide todos os inputs no servidor
- Use HTTPS em produção
- Mantenha SUPABASE_SERVICE_ROLE_KEY privada

## Licença

MIT
