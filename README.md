# Salão Beleza - Sistema de Autenticação

Sistema de autenticação para salão de beleza utilizando React e Supabase.

## Tecnologias

- React
- Vite
- Supabase (Autenticação)
- Docker
- Nginx

## Requisitos

Para desenvolvimento local:
- Node.js 18+
- npm

Para execução com Docker:
- Docker
- Docker Compose

## Configuração

1. Clone este repositório
2. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Construção e Execução com Docker

### Usando Docker Compose (recomendado)

```bash
# Construir e iniciar os containers
docker-compose up -d

# Parar os containers
docker-compose down
```

### Usando Docker diretamente

```bash
# Construir a imagem
docker build -t salaobeleza:latest .

# Executar o container
docker run -p 80:80 salaobeleza:latest
```

## GitHub Packages

Este projeto está configurado para publicar automaticamente a imagem Docker no GitHub Packages quando:
- Um push é feito para a branch `main`
- Uma tag com o formato `v*.*.*` é criada

Para usar a imagem do GitHub Packages:

```bash
# Autenticar no GitHub Container Registry
docker login ghcr.io -u USERNAME -p TOKEN

# Baixar a imagem
docker pull ghcr.io/seu-usuario/salaobeleza:latest

# Executar a imagem
docker run -p 80:80 ghcr.io/seu-usuario/salaobeleza:latest
```

## Estrutura do Projeto

```
salaobeleza/
├── .github/workflows/    # GitHub Actions para CI/CD
├── public/               # Arquivos públicos
├── src/                  # Código fonte
│   ├── components/       # Componentes React
│   ├── lib/              # Bibliotecas e utilitários
│   ├── pages/            # Páginas da aplicação
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Ponto de entrada
├── .dockerignore         # Arquivos ignorados pelo Docker
├── .env                  # Variáveis de ambiente (não comitar!)
├── Dockerfile            # Configuração do Docker
├── docker-compose.yml    # Configuração do Docker Compose
├── nginx.conf            # Configuração do Nginx
└── package.json          # Dependências e scripts
```

## Funcionalidades

- Login de usuários
- Registro de novos usuários
- Verificação de email
- Dashboard protegido
- Rotas protegidas

## Licença

MIT
