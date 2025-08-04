import {
  salvarPalavra,
  listarPalavras,
  buscarPalavraPorId,
  atualizarPalavra,
  excluirPalavra,
  abrirDB
} from './db.js';

import {
  abrirModal,
  fecharModal,
  visualizarPalavra,
  preencherModalCrud,
  salvarConfiguracoes
} from './modal.js';

import { mostrarHistorico } from './historico.js';

document.addEventListener('DOMContentLoaded', () => {
  let palavraEditandoId = null;

  const syncAutoEl = document.getElementById('sync-automatica');
  const ordenacaoEl = document.getElementById('ordenacao');

  if (syncAutoEl && ordenacaoEl) {
    const syncAuto = localStorage.getItem('config_sync') === '1';
    const ordenacao = localStorage.getItem('config_ordenacao') || 'az';

    syncAutoEl.checked = syncAuto;
    ordenacaoEl.value = ordenacao;

    if (syncAuto && typeof sincronizarAgora === 'function') {
      const lastSync = parseInt(localStorage.getItem('last_sync_timestamp'), 10);
      const agora = Date.now();

      if (!lastSync || agora - lastSync > 300000) {
        sincronizarAgora();
      } else {
        console.log('⏳ Sincronização recente, ignorando por enquanto.');
      }
    }
  }

  const statusEl = document.getElementById('status-sincronizacao');
  const ultima = localStorage.getItem('last_sync_time');
  if (ultima && statusEl) {
    statusEl.textContent = `Última sincronização: ${ultima}`;
  }

  const importarEl = document.getElementById('importar');
  if (importarEl) {
    importarEl.addEventListener('change', function () {
      importarDados(this.files[0]);
    });
  }

  const form = document.getElementById('form-palavra');
  const busca = document.getElementById('busca');

  if (form && busca) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dados = Object.fromEntries(new FormData(form));
      dados.id = palavraEditandoId || undefined;

      if (palavraEditandoId) {
        await atualizarPalavra(dados);
        palavraEditandoId = null;
      } else {
        await salvarPalavra(dados);
      }

      form.reset();
      carregarPalavras();
    });

    busca.addEventListener('input', carregarPalavras);
  }

  carregarPalavras();
});

async function carregarPalavras() {
  const busca = document.getElementById('busca');
  const lista = document.getElementById('lista-palavras');

  if (!lista || !busca) return;

  const termoBusca = busca.value.toLowerCase();
  let palavras = await listarPalavras();

  // ✅ Corrigir escopo da ordenação
  const ordenacao = localStorage.getItem('config_ordenacao') || 'az';

  if (ordenacao === 'az') {
    palavras.sort((a, b) => a.termo.localeCompare(b.termo));
  } else if (ordenacao === 'za') {
    palavras.sort((a, b) => b.termo.localeCompare(a.termo));
  } else if (ordenacao === 'recentes') {
    palavras.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  lista.innerHTML = '';

  palavras
    .filter(p => !p.deleted && p.termo.toLowerCase().includes(termoBusca))
    .forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.termo}</strong> (${p.classe || "sem classe"})
        <br />
        <button data-id="${p.uuid}" class="visualizar">👁️ Ver</button>
        <details>
        <summary class="summary-acoes">Ações</summary>
          <button data-id="${p.uuid}" class="editar">✏️ Editar</button>
          <button data-id="${p.uuid}" class="excluir">🗑️ Excluir</button>
          <button data-id="${p.uuid}" class="historico">📜 Histórico</button>
        </details>
      `;
      lista.appendChild(li);
    });

  document.querySelectorAll('.visualizar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const palavra = await buscarPalavraPorId(id);
      visualizarPalavra(palavra);
    });
  });

  document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const palavra = await buscarPalavraPorId(id);
      preencherModalCrud(palavra);
    });
  });

  document.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Tem certeza que deseja excluir esta palavra?')) {
        const palavra = await buscarPalavraPorId(id);
        if (palavra) {
          palavra.deleted = true;
          await salvarPalavra(palavra);
          carregarPalavras();
        }
      }
    });
  });

  document.querySelectorAll('.historico').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      mostrarHistorico(id);
    });
  });
}

// 📤 Exporta dados para JSON
async function exportarDados() {
  const palavras = await listarPalavras();
  const blob = new Blob([JSON.stringify(palavras, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'palavras_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

// 📥 Importa dados de JSON
function importarDados(arquivo) {
  const reader = new FileReader();
  reader.onload = async () => {
    const dados = JSON.parse(reader.result);
    for (const palavra of dados) {
      delete palavra.id;
      await salvarPalavra(palavra);
    }
    carregarPalavras();
  };
  reader.readAsText(arquivo);
}

// 📤 Exporta para MySQL e limpa localmente os excluídos
async function exportarParaMySQL() {
  const palavras = await listarPalavras();
  const response = await fetch('/significados/backend/api/palavras.php?acao=importar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(palavras),
  });

  const text = await response.text();
  try {
    const resultado = JSON.parse(text);
    if (resultado.status === 'success') {
      alert('Palavras exportadas com sucesso!');
      await limparPalavrasExcluidas(); // 🔥 remove os `deleted: true`
      carregarPalavras(); // atualiza UI
      fecharModal('modal-config');
    } else {
      alert('Erro ao exportar palavras');
      console.error(resultado);
    }
  } catch (e) {
    console.error('Resposta inválida do servidor:', text);
    alert('Erro: o servidor não retornou JSON válido.');
  }
}

// 📥 Importa do MySQL
async function importarDoMySQL() {
  const response = await fetch('/significados/backend/api/palavras.php');
  const palavras = await response.json();
  for (const palavra of palavras) {
    await salvarPalavra(palavra);
  }
  alert('Palavras importadas com sucesso!');
  carregarPalavras();
  fecharModal('modal-config');
}

// 🧹 Remove definitivamente palavras com deleted=true
async function limparPalavrasExcluidas() {
  const db = await abrirDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('palavras', 'readwrite');
    const store = tx.objectStore('palavras');
    const getAll = store.getAll();

    getAll.onsuccess = () => {
      const palavras = getAll.result || [];
      palavras.forEach(p => {
        if (p.deleted) store.delete(p.uuid);
      });
    };

    tx.oncomplete = () => {
      console.info('Palavras excluídas logicamente foram removidas do IndexedDB.');
      resolve(true);
    };

    tx.onerror = () => {
      console.error('Erro ao limpar palavras excluídas.');
      reject('Erro ao limpar palavras excluídas');
    };
  });
}

// ✅ Função sincronizarAgora()
function formatarHoraAtual() {
  const agora = new Date();
  return agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sincronizarAgora() {
  const statusEl = document.getElementById('status-sincronizacao');
  if (statusEl) statusEl.textContent = '🔄 Sincronizando...';

  try {
    await exportarParaMySQL();
    await importarDoMySQL();

    const hora = formatarHoraAtual();
    localStorage.setItem('last_sync_time', hora);
    localStorage.setItem('last_sync_timestamp', Date.now().toString());

    if (statusEl) statusEl.textContent = `✅ Sincronizado às ${hora}`;
  } catch (erro) {
    console.error('Erro na sincronização:', erro);
    if (statusEl) statusEl.textContent = '❌ Erro na sincronização';
  }

  carregarPalavras();
}

// 🌐 Disponibiliza no escopo global
window.exportarDados = exportarDados;
window.importarDados = importarDados;
window.exportarParaMySQL = exportarParaMySQL;
window.importarDoMySQL = importarDoMySQL;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.salvarConfiguracoes = salvarConfiguracoes;
window.limparPalavrasExcluidas = limparPalavrasExcluidas;
window.sincronizarAgora = sincronizarAgora;
export { carregarPalavras };
