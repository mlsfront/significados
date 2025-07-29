# Changelog — Significados

## \[v0.4.0] — 2025-07-29

### Adicionado

* **Sincronização bidirecional com MySQL**:

  * Função `exportarParaMySQL()` exporta os dados do IndexedDB para o banco MySQL via API REST.
  * Função `importarDoMySQL()` importa palavras do banco MySQL e salva no IndexedDB, atualizando a interface automaticamente.
  * Mecanismo de *upsert* no backend em `palavras.php`, com lógica para atualizar apenas os dados mais recentes com base em `updated_at`.

* **Modularização com `type="module"`**:

  * Exportação das funções do `db.js` no final do arquivo.
  * Exposição explícita das funções principais no `window` para permitir chamadas a partir do HTML (`onclick`).

* **Validação e feedback do servidor**:

  * Respostas claras de sucesso ou erro ao sincronizar dados, com alertas para o usuário e logs no console para debugging.

### Corrigido

* Problema em que funções como `exportarParaMySQL()` não eram reconhecidas no HTML ao usar `type="module"`.

---

## \[v0.3.0] — 2025-07-29

### Adicionado

* **Correção do fluxo de salvamento de palavras**:

  * Ajuste na função `salvarPalavra` para garantir a autogeração de `id` pelo IndexedDB.
  * Garantia de que o campo `id` não seja passado ao IndexedDB, evitando erros ao salvar.
* **Melhoria na importação de dados**:

  * Função de importação agora limpa corretamente o campo `id` dos dados ao importar para evitar conflitos com a chave autoincrementada.
* **Refatoração de `db.js`**:

  * Função `salvarPalavra` agora trata a remoção do campo `id` antes de adicionar ao IndexedDB, para garantir a integridade do banco de dados.
  * Melhor tratamento de erros para funções que manipulam dados no IndexedDB.

### Corrigido

* **Erro ao salvar palavra**: Erro de `DataError` devido ao uso incorreto de `id` ao tentar salvar palavras no IndexedDB.

---

## \[v0.2.0] — 2025-07-29

### Adicionado

* Layout inicial do frontend SPA em `index.html` com duas seções:

  * Cadastro de nova palavra
  * Listagem e busca de palavras
* Estilos responsivos com `public/css/style.css` usando Flexbox
* Estrutura básica do banco de dados local com IndexedDB:

  * Criação da store `palavras` com `keyPath` autoincrementado
  * Indexação por campo `termo`
* Funções `abrirDB`, `salvarPalavra` e `listarPalavras` em `db.js`
* Integração com o formulário usando `app.js`:

  * Salvamento no IndexedDB
  * Renderização da lista
  * Busca por termo em tempo real

---

## \[v0.1.0] — 2025-07-29

### Adicionado

* Estrutura inicial de projeto com `public/`, `backend/`, `database/`, `capacitor/`
* Arquivos iniciais do backend:

  * `backend/api/palavras.php`
  * `backend/config/db.php`
  * `backend/helpers/functions.php`
* Arquivos do frontend:

  * `public/index.html`
  * `public/css/style.css`
  * `public/js/app.js`, `api.js`, `db.js`
  * `assets/logo.png`, `favicon.ico`
* Esquema SQL inicial em `database/schema.sql`
* Inicialização do Git e configuração do Capacitor
* Criação do `README.md`, `CHANGELOG.md` e `LICENSE`