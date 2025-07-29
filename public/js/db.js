const DB_NAME = 'significadosDB';
const DB_VERSION = 1;
const STORE_NAME = 'palavras';
let db = null;

// 🔓 Abre o IndexedDB (ou cria se não existir)
function abrirDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Erro ao abrir o IndexedDB');

    request.onsuccess = () => {
     console.log('Palavra salva com ID:', request.result); // ID gerado automaticamente
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'uuid',
          autoIncrement: true
        });
        store.createIndex('termo', 'termo', { unique: false });
      }
    };
  });
}

// 💾 Salva palavra
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

async function salvarPalavra(palavra) {
  const db = await abrirDB();

  const agora = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const palavraComDados = {
    ...palavra,
    uuid: palavra.uuid || uuidv4(),
    updated_at: agora
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(palavraComDados); // `put` atualiza se já existir
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Erro ao salvar palavra');
  });
}

// 📚 Lista todas as palavras
async function listarPalavras() {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject('Erro ao listar palavras');
  });
}

// 🔍 Buscar palavra por ID
async function buscarPalavraPorId(id) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Erro ao buscar palavra');
  });
}

// ✏️ Atualiza palavra existente
async function atualizarPalavra(palavra) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(palavra);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao atualizar palavra');
  });
}

// 🗑️ Exclui palavra por ID
async function excluirPalavra(id) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Erro ao excluir palavra');
  });
}

export {
  abrirDB,
  salvarPalavra,
  listarPalavras,
  buscarPalavraPorId,
  atualizarPalavra,
  excluirPalavra
};
