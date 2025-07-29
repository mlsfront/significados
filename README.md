# Significados

**Significados** é uma aplicação web e mobile (via Capacitor) voltada para o estudo e gestão de palavras e seus significados detalhados — incluindo classe gramatical, etimologia, exemplos, sinônimos, antônimos e muito mais.

## 🚀 Funcionalidades

- Cadastro e busca de palavras
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

Veja a estrutura de pastas em `/public`, `/backend`, `/database`, etc.

## 📲 Instalação (desenvolvimento local)

```bash
git clone https://github.com/seu-usuario/significados.git
cd significados
```

1. Coloque os arquivos do `public/` em um servidor local (ex: XAMPP, Live Server).
2. Configure o banco de dados MySQL com o arquivo `database/schema.sql`.
3. Ajuste as credenciais do MySQL em `backend/config/db.php`.

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