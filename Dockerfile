FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=""
ENV VITE_SUPABASE_ANON_KEY=""

# Construir a aplicação
RUN npm run build

# Verificar o conteúdo da pasta dist após a build
RUN ls -la /app/dist

# Estágio de produção
FROM nginx:alpine

# Definir variáveis de ambiente no contêiner de produção
# Estas serão sobrescritas pelas variáveis definidas no Portainer
ENV VITE_SUPABASE_URL=""
ENV VITE_SUPABASE_ANON_KEY=""

# Copiar arquivos de build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar o arquivo de fallback
COPY --from=build /app/public/fallback.html /usr/share/nginx/html/fallback.html

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Verificar se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
