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
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('termo', 'termo', { unique: false });
      }
    };
  });
}

// 💾 Salva nova palavra (sem ID)
async function salvarPalavra(palavra) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    // Se a palavra tem um 'id', excluímos ele (não queremos sobrescrever a chave autoincrementada)
    const palavraComId = { ...palavra };
    delete palavraComId.id;  // Garantimos que o 'id' não seja passado, já que é auto-incrementado.

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(palavraComId);

    request.onsuccess = () => resolve(request.result); // retorna ID gerado
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
