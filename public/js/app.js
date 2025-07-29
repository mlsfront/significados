document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-palavra');
  const lista = document.getElementById('lista-palavras');
  const busca = document.getElementById('busca');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    await salvarPalavra(dados);
    form.reset();
    carregarPalavras();
  });

  busca.addEventListener('input', carregarPalavras);

  async function carregarPalavras() {
    const termoBusca = busca.value.toLowerCase();
    const palavras = await listarPalavras();
    lista.innerHTML = '';

    palavras
      .filter(p => p.termo.toLowerCase().includes(termoBusca))
      .forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.termo} (${p.classe || "sem classe"})`;
        lista.appendChild(li);
      });
  }

  carregarPalavras();
});
