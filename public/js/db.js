const DB_NAME = 'significadosDB';
const DB_VERSION = 1;
let db;

function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Erro ao abrir o IndexedDB');
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const store = db.createObjectStore('palavras', { keyPath: 'id', autoIncrement: true });

      store.createIndex('termo', 'termo', { unique: false });
    };
  });
}

async function salvarPalavra(palavra) {
  const db = await abrirDB();
  const tx = db.transaction('palavras', 'readwrite');
  tx.objectStore('palavras').add(palavra);
  return tx.complete;
}

async function listarPalavras() {
  const db = await abrirDB();
  const tx = db.transaction('palavras', 'readonly');
  const store = tx.objectStore('palavras');
  return store.getAll();
}
