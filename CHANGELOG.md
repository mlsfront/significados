# Changelog — Significados

## [v0.2.0] — 2025-07-29

### Adicionado

- Layout inicial do frontend SPA em `index.html` com duas seções:
  - Cadastro de nova palavra
  - Listagem e busca de palavras
- Estilos responsivos com `public/css/style.css` usando Flexbox
- Estrutura básica do banco de dados local com IndexedDB:
  - Criação da store `palavras` com `keyPath` autoincrementado
  - Indexação por campo `termo`
- Funções `abrirDB`, `salvarPalavra` e `listarPalavras` em `db.js`
- Integração com o formulário usando `app.js`:
  - Salvamento no IndexedDB
  - Renderização da lista
  - Busca por termo em tempo real

---

## [v0.1.0] — 2025-07-29

### Adicionado

- Estrutura inicial de projeto com `public/`, `backend/`, `database/`, `capacitor/`
- Arquivos iniciais do backend:
  - `backend/api/palavras.php`
  - `backend/config/db.php`
  - `backend/helpers/functions.php`
- Arquivos do frontend:
  - `public/index.html`
  - `public/css/style.css`
  - `public/js/app.js`, `api.js`, `db.js`
  - `assets/logo.png`, `favicon.ico`
- Esquema SQL inicial em `database/schema.sql`
- Inicialização do Git e configuração do Capacitor
- Criação do `README.md`, `CHANGELOG.md` e `LICENSE`
