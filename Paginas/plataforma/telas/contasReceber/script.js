// Tenta buscar recebimentos salvos; se não houver, inicia vazio
let recebimentos = JSON.parse(localStorage.getItem('recebimentos')) || [];

// Captura os elementos
const formReceber = document.getElementById('form-receber');
const listaReceber = document.getElementById('lista-receber');
const totalPendenteEl = document.getElementById('total-pendente');
const totalRecebidoEl = document.getElementById('total-recebido');
const totalGeralEl = document.getElementById('total-geral');

// Formatadores
const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

const formatarData = (dataString) => {
    const data = new Date(dataString + 'T00:00:00'); 
    return new Intl.DateTimeFormat('pt-BR').format(data);
};

// Salva no LocalStorage
const salvarDados = () => {
    localStorage.setItem('recebimentos', JSON.stringify(recebimentos));
};

// Atualiza o Resumo Financeiro
const atualizarResumo = () => {
    let totalPendente = 0;
    let totalRecebido = 0;

    recebimentos.forEach(item => {
        if (item.recebido) {
            totalRecebido += item.valor;
        } else {
            totalPendente += item.valor;
        }
    });

    totalPendenteEl.textContent = formatarMoeda(totalPendente);
    totalRecebidoEl.textContent = formatarMoeda(totalRecebido);
    totalGeralEl.textContent = formatarMoeda(totalPendente + totalRecebido);
};

// Renderiza a Tabela
const renderizarTabela = () => {
    listaReceber.innerHTML = '';

    if (recebimentos.length === 0) {
        listaReceber.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum recebimento cadastrado ainda.</td></tr>`;
    }

    recebimentos.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (item.recebido) tr.classList.add('linha-paga');

        const badgeHTML = item.recebido 
            ? `<span class="badge success">Recebido</span>` 
            : `<span class="badge warning">A Receber</span>`;

        tr.innerHTML = `
            <td style="font-weight: 500;">${item.cliente}</td>
            <td style="font-weight: 600;">${formatarMoeda(item.valor)}</td>
            <td>${formatarData(item.vencimento)}</td>
            <td style="color: var(--text-muted);">${item.meio}</td>
            <td>${badgeHTML}</td>
            <td style="text-align: right;">
                <button class="btn-action ${item.recebido ? 'outline' : 'success'}" onclick="alternarStatus(${index})">
                    ${item.recebido ? 'Desfazer' : 'Receber'}
                </button>
                <button class="btn-action danger" onclick="excluirItem(${index})">
                    Excluir
                </button>
            </td>
        `;
        listaReceber.appendChild(tr);
    });

    atualizarResumo();
};

// Evento de Formulário
formReceber.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const vencimento = document.getElementById('vencimento').value;
    const meio = document.getElementById('meio-pagamento').value;

    recebimentos.push({ 
        cliente, 
        valor, 
        vencimento, 
        meio, 
        recebido: false 
    });
    
    salvarDados();
    formReceber.reset();
    document.getElementById('cliente').focus();
    renderizarTabela();
});

// Ações
window.alternarStatus = (index) => {
    recebimentos[index].recebido = !recebimentos[index].recebido;
    salvarDados();
    renderizarTabela();
};

window.excluirItem = (index) => {
    if (confirm('Tem certeza que deseja remover este recebimento?')) {
        recebimentos.splice(index, 1);
        salvarDados();
        renderizarTabela();
    }
};

// Inicia a página
renderizarTabela();