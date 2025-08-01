async function enviarPalavraParaServidor(palavra) {
  const response = await fetch('/backend/api/palavras.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(palavra)
  });

  return response.ok ? response.json() : Promise.reject('Erro ao enviar');
}
