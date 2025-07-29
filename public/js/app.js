document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('importar').addEventListener('change', function () {
    importarDados(this.files[0]);
  });

  const form = document.getElementById('form-palavra');
  const lista = document.getElementById('lista-palavras');
  const busca = document.getElementById('busca');

  let palavraEditandoId = null;

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

  carregarPalavras();
});

// 🔄 Agora essa função é global
async function carregarPalavras() {
  const busca = document.getElementById('busca');
  const lista = document.getElementById('lista-palavras');
  const form = document.getElementById('form-palavra');
  const termoBusca = busca.value.toLowerCase();
  const palavras = await listarPalavras();
  lista.innerHTML = '';

  palavras
    .filter(p => p.termo.toLowerCase().includes(termoBusca))
    .forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.termo}</strong> (${p.classe || "sem classe"})
        <br />
        <button data-id="${p.id}" class="editar">✏️ Editar</button>
        <button data-id="${p.id}" class="excluir">🗑️ Excluir</button>
      `;
      lista.appendChild(li);
    });

  document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const palavra = await buscarPalavraPorId(id);
      preencherFormulario(palavra);
    });
  });

  document.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      if (confirm('Tem certeza que deseja excluir esta palavra?')) {
        await excluirPalavra(id);
        carregarPalavras();
      }
    });
  });

  function preencherFormulario(palavra) {
    form.termo.value = palavra.termo;
    form.classe.value = palavra.classe;
    form.denotativo.value = palavra.denotativo;
    form.conotacoes.value = palavra.conotacoes;
    form.registro.value = palavra.registro;
    form.traducao.value = palavra.traducao;
    palavraEditandoId = palavra.id;
  }
}

// 📤 Exportar
async function exportarDados() {
  const palavras = await listarPalavras();
  console.log("Resultado de listarPalavras:", palavras);
  const blob = new Blob([JSON.stringify(palavras, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'palavras_backup.json';
  a.click();

  URL.revokeObjectURL(url);
}

// 📥 Importar
function importarDados(arquivo) {
  const reader = new FileReader();
  reader.onload = async () => {
    const dados = JSON.parse(reader.result);
    for (const palavra of dados) {
      delete palavra.id; // evitar conflitos
      await salvarPalavra(palavra);
    }
    carregarPalavras();
  };
  reader.readAsText(arquivo);
}

