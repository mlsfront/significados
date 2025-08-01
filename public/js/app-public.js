import {
  listarPalavras,
  buscarPalavraPorId
} from './db.js';

import {
  abrirModal,
  fecharModal,
  visualizarPalavra
} from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  const busca = document.getElementById('busca');
  if (busca) {
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

  palavras.sort((a, b) => a.termo.localeCompare(b.termo));

  lista.innerHTML = '';
  palavras
    .filter(p => !p.deleted && p.termo.toLowerCase().includes(termoBusca))
    .forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.termo}</strong> (${p.classe || "sem classe"})
        <br />
        <button data-id="${p.uuid}" class="visualizar">👁️ Ver</button>
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
}

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.visualizarPalavra = visualizarPalavra;
