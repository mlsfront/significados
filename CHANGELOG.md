# Changelog — Significados

## \[v0.9.0] - 2025-07-30

### Adicionado
- Separação das páginas em `index.htm` para listagem pública e `adm.htm` para administração completa.
- Implementação do script `app-public.js` para listagem e visualização sem edição.
- Modal de visualização aprimorada para não mostrar botões de edição/exclusão na página pública.

### Corrigido
- Prevenção de erros quando elementos do DOM não existem, com verificações condicionais ao acessar elementos.
- Melhor experiência do usuário ao não mostrar campos vazios no modal de visualização (novo comportamento implementado).

### Melhorias
- Ajustes para evitar erros ao carregar listas e configurar modais.
- Implementação da função para não apresentar campos vazios no modal de visualização para melhorar UX.
- Atualização do README com instruções para uso das duas páginas (pública e admin).

---

## \[v0.8.2] - 30-07-2025

### Adicionado
- Componentes  para agrupar os botões de ação, afinando a interface.
- Estilos personalizados para os botões de ação com cores específicas para melhor usabilidade.
- Suporte a responsividade para diferentes tamanhos de tela (mobile e tablet).

---

## \[0.8.1] - 2025-07-29
### Funcionalidades
- Adicionada exibição do histórico de alterações por palavra via botão 📜.
- Implementado suporte à nova coluna `etimologia` no banco de dados, IndexedDB e interface.

### Melhorias
- Implementada ordenação configurável na interface:
  - `A-Z`, `Z-A` e `Recentes` com base em `updated_at`.
  - Preferência de ordenação é salva no `localStorage` e aplicada automaticamente ao iniciar.
- Sincronização automática com MySQL:
  - Agora só é executada se a última sincronização foi há mais de 5 minutos.
  - `last_sync_time` (para exibição) e `last_sync_timestamp` (para controle interno) são armazenados.
  - Mensagens de status mais claras: "🔄 Sincronizando...", "✅ Sincronizado às ...", "❌ Erro...".

### Refatorações
- Separação entre controle e exibição no mecanismo de sincronização.
- Função `carregarPalavras()` agora aplica ordenação antes de filtrar por busca.
- Código da tela principal reorganizado para refletir as configurações salvas.

---

## \[0.8.0] - 2025-07-29
### Adicionado
- Endpoint `historico.php` para exibir o histórico de alterações de uma palavra via UUID.
- Decodificação automática dos campos `dados_anteriores` e `dados_novos` no retorno JSON.
- Validação básica de parâmetros no backend para garantir integridade da consulta.

### Melhorias
- Estrutura padronizada de resposta em erros (`status`, `message`, `error`).

---

## \[v0.7.1] - 2025-07-29

### Adicionado
- Suporte completo à nova coluna `etimologia`:
  - Atualizações no formulário HTML de criação e edição.
  - Exibição da etimologia no modal de visualização.
  - Suporte no IndexedDB (`db.js`) e exportações/importações.
  - Sincronização bidirecional com backend PHP e MySQL.

---

## \[0.7.0] - 2025-07-29

### Adicionado
- Função `sincronizarAgora()` que combina exportação e importação com feedback visual.
- Registro de `last_sync_time` em `localStorage` para exibir o horário da última sincronização manual.
- Interface atualizada com botão de "Sincronizar Agora" e status dinâmico.

---

## \[v0.6.0] - 2025-07-29

### Adicionado
- Implementada exclusão lógica de palavras no IndexedDB, marcando como `deleted: true` para evitar remoção imediata e garantir sincronização segura.
- Função `limparPalavrasExcluidas()` criada para remover permanentemente as palavras marcadas como excluídas após exportação para MySQL.
- Atualização no fluxo de exclusão na interface para refletir a exclusão lógica, com confirmação do usuário.
- Exportação para MySQL agora executa limpeza automática das palavras logicamente excluídas localmente, mantendo banco sincronizado e limpo.
- Melhorias gerais na sincronização entre IndexedDB e backend MySQL para evitar conflitos de dados e perda acidental.

### Corrigido
- Ajustes no carregamento da lista para ignorar palavras marcadas como excluídas.
- Tratamento aprimorado para evitar inconsistências entre o banco local e o servidor durante operações CRUD.

---

## \[v0.5.0] - 2025-07-29

### ✨ Novidades

- Adicionada **modal CRUD** para editar/criar palavras de forma mais clara e isolada da interface principal.
- Criada **modal de visualização** com todos os campos da palavra, acessível via botão "👁️ Ver".
- Implementada **modal de configurações** com opções de:
  - Sincronização automática com MySQL
  - Ordenação A-Z, Z-A ou por data
- Botão de acesso rápido à modal de configurações diretamente no header.

### ✅ Funcionalidades

- Reorganização da interface com `<details>` para cadastro simplificado.
- Campos do formulário de cadastro e edição são reaproveitados.
- Implementada edição por modal com `uuid` como identificador persistente.
- Modal CRUD carrega e salva dados corretamente via IndexedDB.
- Modal "Ver" mostra todos os campos da palavra de forma limpa.
- Backup e importação/exportação funcionando com JSON e MySQL.
- Importação agora trata duplicações ao remover `id`.

### 🐞 Correções e melhorias internas

- Refatorado `app.js` para separar melhor as responsabilidades de visualização, edição e exclusão.
- `modal.js` agora centraliza abertura/fechamento de modais e manipulação do conteúdo de cada tipo.
- Adicionados botões de ação nas listas com escuta dinâmica de eventos.
- Melhor feedback no console para falhas de modal ou exportação.

### 🧪 Limitações conhecidas

- **Exclusões feitas no IndexedDB não são sincronizadas com o MySQL.**
  - Será tratado na próxima versão (`v0.6.0`).
- Ainda há uso de `alert()` para feedback de exportação, sem UX visual refinada.

---

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