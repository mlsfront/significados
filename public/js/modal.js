// Abrir um modal pelo ID
export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal && typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    console.error(`Modal "${id}" não encontrado ou não suportado.`);
  }
}

// Fechar um modal pelo ID
export function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.close();
}

// Preenche e abre o modal de edição/criação de palavra
export function preencherModalCrud(palavra = {}) {

  const form = document.getElementById('form-modal-palavra');
  form.reset(); // limpa campos

  const campos = ['termo', 'classe', 'denotativo', 'conotacoes', 'registro', 'traducao', 'etimologia'];
  for (const campo of campos) {
    form.elements[campo].value = palavra[campo] || '';
  }

  // Salva ID da palavra sendo editada (assuma uuid)
  form.dataset.editandoUuid = palavra.uuid || '';

  abrirModal('modal-crud');
}

// Exibe dados da palavra no modal de visualização
export function visualizarPalavra(palavra) {
  const div = document.getElementById('visualizar-conteudo');
  if (!palavra || !div) return;

  // Campos com label
  const campos = [
    { label: 'Classe', valor: palavra.classe },
    { label: 'Denotativo', valor: palavra.denotativo },
    { label: 'Conotações', valor: palavra.conotacoes },
    { label: 'Registro', valor: palavra.registro },
    { label: 'Tradução', valor: palavra.traducao },
    { label: 'Etimologia', valor: palavra.etimologia }
  ];

  // Somente campos com valor não vazio
  const conteudoCampos = campos
    .filter(c => c.valor && c.valor.trim() !== '')
    .map(c => `<p><strong>${c.label}:</strong> ${c.valor}</p>`)
    .join('\n');

  div.innerHTML = `
    <strong>${palavra.termo || '(sem termo)'}</strong>
    ${conteudoCampos || '<p><em>Sem informações adicionais.</em></p>'}
  `;

  abrirModal('modal-visualizar');
}

// Salva configurações no localStorage
export function salvarConfiguracoes() {
  const syncAuto = document.getElementById('sync-automatica')?.checked;
  const ordenacao = document.getElementById('ordenacao')?.value;

  localStorage.setItem('config_sync', syncAuto ? '1' : '0');
  localStorage.setItem('config_ordenacao', ordenacao || 'az');

  fecharModal('modal-config');

  // Reaplica estados imediatamente:
  carregarPalavras();
  if (syncAuto && typeof sincronizarAgora === 'function') {
    sincronizarAgora();
  }
}

import { atualizarPalavra, salvarPalavra } from './db.js';
import { carregarPalavras } from './app.js'; // certifique-se que está exportado corretamente

// Trata o envio do formulário no modal de edição
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-modal-palavra');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const dados = Object.fromEntries(new FormData(form));
      const uuid = form.dataset.editandoUuid;

      if (uuid) {
        dados.uuid = uuid;
        await atualizarPalavra(dados);
        exibirFeedback('Palavra atualizada com sucesso!');
      } else {
        await salvarPalavra(dados);
        exibirFeedback('Nova palavra criada com sucesso!');
      }

      form.reset();
      form.removeAttribute('data-editando-uuid');
      fecharModal('modal-crud');
      carregarPalavras(); // atualiza a lista
    });
  }
});

function exibirFeedback(msg) {
  alert(msg); // ou substitua por snackbar/toast moderno
}
