# Significados

**Significados** é uma aplicação web e mobile (via Capacitor) voltada para o estudo e gestão de palavras e seus significados detalhados — incluindo classe gramatical, etimologia, exemplos, sinônimos, antônimos e muito mais.

## 🚀 Funcionalidades

- Cadastro, edição e busca de palavras (página administrativa)
- Listagem pública e visualização de palavras (página pública)
- Armazenamento local com IndexedDB (offline)
- Sincronização com banco de dados MySQL (remoto)
- Interface responsiva
- Exportação como APK para Android

## 🧱 Tecnologias

- HTML5, CSS3, JavaScript ES6+
- IndexedDB
- PHP + PDO (API segura)
- MySQL
- Capacitor.js

## 📦 Estrutura do Projeto

- `/public` — arquivos front-end, contendo duas páginas principais:
  - **`adm.html`** — página administrativa com todas as funcionalidades completas (cadastro, edição, configurações, sincronização etc.). Usa o script `js/app.js`.
  - **`index.html`** — página pública com listagem e botão para visualizar o conteúdo das palavras, sem possibilidade de editar ou alterar. Usa o script `js/app-public.js`.
- `/backend` — API e scripts PHP para comunicação com o banco MySQL.
- `/database` — scripts para criar e configurar o banco MySQL.
- `/js` — scripts JavaScript do projeto (db.js, modal.js, app.js, app-public.js, etc.)
- `/css` — folhas de estilo

## 📲 Instalação (desenvolvimento local)

```bash
git clone https://github.com/mlsfront/significados.git
cd significados
```

1. Coloque os arquivos do diretório `public/` em um servidor local (ex: XAMPP, Live Server).
2. Configure o banco de dados MySQL com o arquivo `database/schema.sql`.
3. Ajuste as credenciais do MySQL em `backend/config/db.php`.
4. Acesse:
   - `adm.html` para a administração e gerência de dados.
   - `index.html` para acesso público somente à lista e visualização.

## 🛠 Uso

- **Página administrativa (`adm.html`)**: permite o cadastro, edição, exclusão, backup, sincronização e configurações. Requer login ou controle de acesso via servidor (não incluso).
- **Página pública (`index.html`)**: lista as palavras disponíveis e permite visualizar suas informações sem risco de alterar dados, ideal para compartilhamento público.

## 📱 Gerar APK

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
npx cap add android
npx cap copy
npx cap open android
```

## 📌 Autores

* MLSFront — idealizador e desenvolvedor

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
