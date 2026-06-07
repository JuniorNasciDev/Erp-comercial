// Pega o campo de seleção e a caixa de datas
  const periodFilter = document.getElementById('periodFilter');
  const customDateBox = document.getElementById('customDateBox');

  // Fica "escutando" as mudanças no select
  periodFilter.addEventListener('change', function() {
    // Se o cliente escolheu "personalizado", remove a classe hidden
    if (this.value === 'personalizado') {
      customDateBox.classList.remove('hidden');
    } else {
      // Se escolheu outra coisa (hoje, semana), esconde de novo
      customDateBox.classList.add('hidden');
    }
  });