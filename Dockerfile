FROM oven/bun:latest

WORKDIR /app/api

# Copiar arquivos de configuração
COPY api/package.json api/bun.lockb* ./

# Instalar dependências
RUN bun install --frozen-lockfile

# Copiar código-fonte
COPY api/src ./src
COPY api/tsconfig.json ./

# Exposer a porta
EXPOSE 3000

# Iniciar aplicação
CMD ["bun", "run", "dev"]
