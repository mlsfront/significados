import { abrirModal, fecharModal } from './modal.js';

export async function buscarHistorico(uuid) {
  const response = await fetch(`/significados/backend/api/historico.php?palavra_uuid=${uuid}`);
  if (!response.ok) throw new Error('Erro ao buscar histórico');
  return response.json();
}

export async function mostrarHistorico(uuid) {
  try {
    const historico = await buscarHistorico(uuid);
    const divConteudo = document.getElementById('modal-historico-conteudo');
    divConteudo.innerHTML = historico.length === 0
      ? '<p>Nenhuma alteração registrada.</p>'
      : historico.map(h => `
          <div class="historico-item">
            <strong>${h.acao.toUpperCase()}</strong> em ${new Date(h.data_alteracao).toLocaleString()} por ${h.usuario || 'Desconhecido'}
            <pre>Antes: ${JSON.stringify(h.dados_anteriores, null, 2)}</pre>
            <pre>Depois: ${JSON.stringify(h.dados_novos, null, 2)}</pre>
          </div>
        `).join('');
    abrirModal('modal-historico');
  } catch (e) {
    alert('Erro ao carregar histórico: ' + e.message);
  }
}
