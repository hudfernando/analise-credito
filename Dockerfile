# Estágio 1: Build da Aplicação
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência e instala (otimiza o cache)
COPY package*.json ./
RUN npm install

# Copia o resto do código e builda a aplicação
COPY . .
RUN npm run build

# Estágio 2: Imagem Final (muito menor)
FROM node:20-alpine AS runner
WORKDIR /app

# Copia os arquivos da build e as dependências de produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar o servidor de produção
CMD ["npm", "start"]