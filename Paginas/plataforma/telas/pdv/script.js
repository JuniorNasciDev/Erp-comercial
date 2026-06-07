// =========================================================
// 1. VARIÁVEIS GLOBAIS E ELEMENTOS DOM
// =========================================================
let carrinho = [];
let subtotalGlobal = 0;
let descontoItensGlobal = 0;
let descontoFinalGeral = 0; 
let finalTotal = 0; 

let caixa = {
    aberto: false,
    operador: "",
    fundoInicial: 0,
    vendas: { dinheiro: 0, cartao: 0, pix: 0 }
};

const productInput = document.getElementById('productInput');
const cartBody = document.getElementById('cartBody');
const emptyState = document.getElementById('emptyState');
const cartTable = document.getElementById('cartTable');
const modalOverlay = document.getElementById('modalOverlay');

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// =========================================================
// 2. LÓGICA DO CARRINHO (Multiplicador, Inserção no Topo e Toast)
// =========================================================
function addMockProduct() {
    if (!caixa.aberto) {
        alert("Atenção: Abra o caixa primeiro para começar a registrar produtos!");
        abrirPainelCaixa();
        return;
    }

    let inputValue = productInput.value.trim();
    let qtdAdicionada = 1;
    let nomeProdutoPesquisa = inputValue;

    // LÓGICA DO MULTIPLICADOR (Ex: 5* ou 5*Cerveja)
    const regexMultiplicador = /^(\d+)\*(.*)/;
    const match = inputValue.match(regexMultiplicador);

    if (match) {
        qtdAdicionada = parseInt(match[1]); // Pega o número antes do *
        nomeProdutoPesquisa = match[2].trim(); // Pega o texto depois do *
    }

    const nomeProduto = nomeProdutoPesquisa !== "" ? nomeProdutoPesquisa.charAt(0).toUpperCase() + nomeProdutoPesquisa.slice(1) : "Produto Genérico";
    const precoProduto = Math.floor(Math.random() * 100) + 15.90; 

    const item = {
        id: Date.now(),
        nome: nomeProduto,
        codigo: Math.floor(Math.random() * 100000000).toString(),
        qtd: qtdAdicionada,
        preco: precoProduto,
        desconto: 0,
        total: precoProduto * qtdAdicionada
    };

    // UNSHIFT: Adiciona no topo do carrinho (não no final)
    carrinho.unshift(item);
    atualizarCarrinho();
    
    // Dispara alerta verde na tela
    showToast(`${qtdAdicionada}x ${nomeProduto} adicionado!`);

    productInput.value = '';
    productInput.focus();
}

function atualizarCarrinho() {
    cartBody.innerHTML = '';
    subtotalGlobal = 0;
    descontoItensGlobal = 0;

    if (carrinho.length === 0) {
        emptyState.style.display = 'flex';
        cartTable.style.display = 'none';
        descontoFinalGeral = 0; // Zera o desconto global se esvaziar
        const inputGlobal = document.getElementById('discountInput');
        if(inputGlobal) inputGlobal.value = '';
    } else {
        emptyState.style.display = 'none';
        cartTable.style.display = 'table';

        carrinho.forEach((item, index) => {
            const subtotalItem = item.preco * item.qtd;
            const descontoItemTotal = item.desconto * item.qtd;
            
            subtotalGlobal += subtotalItem;
            descontoItensGlobal += descontoItemTotal;
            
            let badgeDesconto = item.desconto > 0 
                ? `<div style="font-size: 0.75rem; color: var(--success); margin-top: 0.25rem;">Desconto: - ${formatCurrency(item.desconto)} un</div>` 
                : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="vertical-align: middle; padding: 1rem;">
                    <div class="item-name" style="font-weight: 500; margin-bottom: 0.15rem;">${item.nome}</div>
                    <div class="item-code" style="font-size: 0.75rem; color: var(--text-muted);">${item.codigo}</div>
                    ${badgeDesconto}
                </td>
                <td style="vertical-align: middle; padding: 1rem;">
                    <input type="number" value="${item.qtd}" min="1" 
                           onchange="atualizarQtd(${index}, this.value)" 
                           style="width: 70px; padding: 0.5rem; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 0.375rem; outline: none; text-align: center; font-size: 0.875rem;">
                </td>
                <td style="vertical-align: middle; padding: 1rem;">${formatCurrency(item.preco)}</td>
                <td style="vertical-align: middle; padding: 1rem; font-weight: 600; color: var(--primary);">${formatCurrency(item.total)}</td>
                <td style="vertical-align: middle; padding: 1rem;">
                    <div style="display: flex; gap: 0.75rem; justify-content: center; align-items: center;">
                        <button onclick="abrirModalDescontoItem(${index})" title="Aplicar Desconto" style="background: transparent; border: none; color: var(--warning); cursor: pointer; font-size: 1.25rem; transition: 0.2s; display: flex; align-items: center;">
                            <i class='bx bxs-purchase-tag'></i>
                        </button>
                        <button onclick="removerItem(${index})" title="Remover Item" style="background: transparent; border: none; color: var(--danger); cursor: pointer; font-size: 1.25rem; transition: 0.2s; display: flex; align-items: center;">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            `;
            cartBody.appendChild(tr);
        });
    }
    
    atualizarResumoValores();
}

function atualizarResumoValores() {
    // Matemática do Resumo
    const totalDescontosAcumulados = descontoItensGlobal + descontoFinalGeral;
    finalTotal = Math.max(0, subtotalGlobal - totalDescontosAcumulados);

    // Atualiza Painel Lateral
    document.getElementById('subtotalDisplay').textContent = formatCurrency(subtotalGlobal);
    document.getElementById('descontosDisplay').textContent = formatCurrency(totalDescontosAcumulados);
    document.getElementById('totalValue').textContent = formatCurrency(finalTotal);
    
    // Atualiza Modal de Checkout
    const modalTotal = document.getElementById('modalTotalValue');
    if(modalTotal) modalTotal.textContent = formatCurrency(finalTotal);
}

function atualizarQtd(index, novaQtd) {
    novaQtd = parseInt(novaQtd);
    if (novaQtd < 1) novaQtd = 1;
    
    carrinho[index].qtd = novaQtd;
    carrinho[index].total = (carrinho[index].preco - carrinho[index].desconto) * novaQtd;
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// =========================================================
// 3. TOAST NOTIFICATION (Alerta Visual Flutuante)
// =========================================================
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    
    if(!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.style.display = 'flex';
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 2500); // Some após 2,5 segundos
}

// =========================================================
// 4. LÓGICA DE DESCONTOS (Individual e Global)
// =========================================================
function abrirModalDescontoItem(index) {
    const item = carrinho[index];
    document.getElementById('indexItemDesconto').value = index;
    document.getElementById('nomeProdutoDesconto').innerText = `Produto: ${item.nome} (${formatCurrency(item.preco)})`;
    document.getElementById('valorDescontoItem').value = '';
    openModal('modal-desconto-item');
}

function confirmarDescontoItem() {
    const index = document.getElementById('indexItemDesconto').value;
    const valorInput = parseFloat(document.getElementById('valorDescontoItem').value) || 0;
    const tipo = document.getElementById('tipoDescontoItem').value;
    const item = carrinho[index];

    let valorDescontoEmReais = tipo === 'percent' ? item.preco * (valorInput / 100) : valorInput;

    if (valorDescontoEmReais > item.preco) {
        alert("O desconto não pode ser maior que o valor do produto!");
        return;
    }

    item.desconto = valorDescontoEmReais;
    item.total = (item.preco - item.desconto) * item.qtd;

    atualizarCarrinho();
    closeAllModals();
}

function applyDiscount() {
    const discountInput = parseFloat(document.getElementById('discountInput').value) || 0;
    const discountType = document.getElementById('discountType').value;
    
    if (discountType === 'fixed') {
        descontoFinalGeral = discountInput;
    } else {
        descontoFinalGeral = (subtotalGlobal * discountInput) / 100;
    }
    
    atualizarResumoValores();
}

// =========================================================
// 5. LÓGICA DE CHECKOUT
// =========================================================
function initiateCheckout() {
    if (!caixa.aberto) {
        alert("Atenção: O caixa está fechado! Abra o caixa antes de realizar vendas.");
        abrirPainelCaixa();
        return;
    }
    if (carrinho.length === 0) {
        alert("Adicione itens ao carrinho antes de finalizar!");
        return;
    }

    openModal('modal-pagamento');
}

function selectPayment(element) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function confirmPayment() {
    if(!caixa.aberto) return;
    
    caixa.vendas.dinheiro += finalTotal; 
    
    alert(`Pagamento de ${formatCurrency(finalTotal)} aprovado com sucesso!`);
    carrinho = [];
    atualizarCarrinho();
    removerClienteNota();
    closeAllModals();
}

// =========================================================
// 6. LÓGICA DE CAIXA E OPERADOR
// =========================================================
function abrirPainelCaixa() {
    caixa.aberto ? prepararFechamento() : openModal('modal-abrir-caixa');
    if(caixa.aberto) openModal('modal-fechar-caixa');
    
    if(!caixa.aberto) {
        setTimeout(() => {
            const inputOp = document.getElementById('nomeOperadorInput');
            if(inputOp) inputOp.focus();
        }, 100);
    }
}

function confirmarAberturaCaixa() {
    const inputOp = document.getElementById('nomeOperadorInput');
    const nomeOperador = inputOp ? inputOp.value.trim() : "Admin";
    const valorInicial = parseFloat(document.getElementById('trocoInicial').value) || 0;
    
    if (nomeOperador === "") {
        alert("Obrigatório: Identifique o operador para assumir o caixa.");
        if(inputOp) inputOp.focus();
        return;
    }

    caixa.aberto = true;
    caixa.operador = nomeOperador;
    caixa.fundoInicial = valorInicial;
    caixa.vendas = { dinheiro: 0, cartao: 0, pix: 0 };
    
    atualizarInterfaceCaixa();
    closeAllModals();
    alert(`Caixa aberto com sucesso!\nOperador logado: ${nomeOperador}\nFundo de troco: ${formatCurrency(valorInicial)}`);
}

function prepararFechamento() {
    const resumoOp = document.getElementById('resumoOperador');
    if(resumoOp) resumoOp.innerText = caixa.operador;
    
    document.getElementById('resumoFundo').innerText = formatCurrency(caixa.fundoInicial);
    document.getElementById('resumoDinheiro').innerText = `+ ${formatCurrency(caixa.vendas.dinheiro)}`;
    
    let outros = caixa.vendas.cartao + caixa.vendas.pix;
    document.getElementById('resumoOutros').innerText = `+ ${formatCurrency(outros)}`;
    
    let totalEsperadoGaveta = caixa.fundoInicial + caixa.vendas.dinheiro;
    document.getElementById('resumoTotalEsperado').innerText = formatCurrency(totalEsperadoGaveta);
    
    document.getElementById('valorApurado').value = '';
    document.getElementById('alertaDiferenca').innerText = '';
}

function calcularDiferenca() {
    const totalEsperado = caixa.fundoInicial + caixa.vendas.dinheiro;
    const valorApurado = parseFloat(document.getElementById('valorApurado').value) || 0;
    const diferenca = valorApurado - totalEsperado;
    
    const alerta = document.getElementById('alertaDiferenca');
    if (diferenca === 0) {
        alerta.innerText = "Caixa batendo perfeitamente!";
        alerta.style.color = "var(--success)";
    } else if (diferenca > 0) {
        alerta.innerText = `Sobra: ${formatCurrency(diferenca)}`;
        alerta.style.color = "var(--warning)";
    } else {
        alerta.innerText = `Falta: ${formatCurrency(Math.abs(diferenca))}`;
        alerta.style.color = "var(--danger)";
    }
}

function confirmarFechamentoCaixa() {
    caixa.aberto = false;
    atualizarInterfaceCaixa();
    closeAllModals();
    alert("Turno encerrado. Caixa fechado com sucesso!");
}

function atualizarInterfaceCaixa() {
    const indicator = document.getElementById('caixaStatusIndicator');
    const icon = document.getElementById('caixaIcon');
    const text = document.getElementById('caixaStatusText');
    const sub = document.getElementById('caixaStatusSub');
    const operadorDisplay = document.getElementById('nomeOperadorDisplay'); 

    if(!indicator) return;

    if (caixa.aberto) {
        indicator.className = 'status-caixa aberto';
        icon.className = 'bx bx-lock-open';
        text.innerText = 'Caixa Aberto';
        sub.innerText = 'Vendas liberadas.';
        if(operadorDisplay) operadorDisplay.innerText = caixa.operador;
    } else {
        indicator.className = 'status-caixa fechado';
        icon.className = 'bx bx-lock';
        text.innerText = 'Caixa Fechado';
        sub.innerText = 'Abra o caixa para vender.';
        if(operadorDisplay) operadorDisplay.innerText = "Nenhum";
    }
}

// =========================================================
// 7. SISTEMA DE MODAIS E ATALHOS GERAIS
// =========================================================
function openModal(modalId) {
    document.querySelectorAll('.modal-box').forEach(box => box.style.display = 'none');
    modalOverlay.style.display = 'flex';
    document.getElementById(modalId).style.display = 'block';
}

function closeAllModals() {
    modalOverlay.style.display = 'none';
    if(productInput) productInput.focus(); 
}

function closeOnBackdrop(e) {
    if (e.target === modalOverlay) closeAllModals();
}

function mockSave(tipo) {
    alert(`${tipo} salvo com sucesso!`);
    closeAllModals();
}

// Relógio em Tempo Real
setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById('sys-clock');
    const dateEl = document.getElementById('sys-date');
    if (clockEl && dateEl) {
        clockEl.innerHTML = `<i class='bx bx-time-five'></i> ${now.toLocaleTimeString('pt-BR')}`;
        dateEl.innerHTML = `<i class='bx bx-calendar'></i> ${now.toLocaleDateString('pt-BR')}`;
    }
}, 1000);

// Cancelar e Suspender
function cancelarVenda() {
    if (carrinho.length === 0) return;
    if(confirm("Tem certeza que deseja cancelar esta venda e limpar o carrinho?")) {
        carrinho = [];
        atualizarCarrinho();
        removerClienteNota();
    }
}

function suspenderVenda() {
    if (carrinho.length === 0) return alert("O carrinho já está vazio.");
    alert("Venda suspensa com sucesso! Ela foi enviada para o Histórico.");
    carrinho = [];
    atualizarCarrinho();
    removerClienteNota();
}

// Vincular Cliente
function confirmarVincularCliente() {
    const input = document.getElementById('inputCpfCliente').value.trim();
    if (input === "") return alert("Digite um nome ou CPF válido.");
    
    const nomeEl = document.getElementById('nomeClienteVenda');
    if (nomeEl) {
        nomeEl.innerText = `CPF/Nome: ${input}`;
        nomeEl.style.color = "var(--primary)";
    }
    closeAllModals();
}

function removerClienteNota() {
    const nomeEl = document.getElementById('nomeClienteVenda');
    const inputEl = document.getElementById('inputCpfCliente');
    if (nomeEl) {
        nomeEl.innerText = "Consumidor Final";
        nomeEl.style.color = "var(--text-main)";
    }
    if (inputEl) inputEl.value = "";
    closeAllModals();
}

// Inicialização
window.onload = () => {
    if(productInput) productInput.focus();
    atualizarInterfaceCaixa();
    atualizarCarrinho();
};

document.addEventListener('keydown', (e) => {
    if (modalOverlay.style.display === 'flex' && e.key === 'Escape') {
        closeAllModals();
    } else if (e.key === 'F1') {
        e.preventDefault();
        closeAllModals();
        if(productInput) productInput.focus();
    } else if (e.key === 'F8') {
        e.preventDefault();
        cancelarVenda();
    } else if (e.key === 'F10') {
        e.preventDefault();
        initiateCheckout();
    } else if (e.key === 'Enter' && document.activeElement === productInput) {
        e.preventDefault();
        addMockProduct();
    }
});