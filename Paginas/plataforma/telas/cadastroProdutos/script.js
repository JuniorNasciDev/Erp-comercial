/* ==========================================================================
   1. SISTEMA DE ABAS (TABS)
   ========================================================================== */
function openTab(evt, tabName) {
    // Esconde todos os conteúdos das abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remove a classe 'active' de todos os botões de aba
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Mostra a aba atual e destaca o botão clicado
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

/* ==========================================================================
   2. CALCULADORA DE PREÇO (BIDIRECIONAL) E LUCRO
   ========================================================================== */
// Função auxiliar para pegar valor numérico limpo (evita erros de NaN)
function getValorNumero(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

// Atualiza os painéis visuais verdes/vermelhos de Custo Total e Lucro
function atualizarPaineisCalculadora(custoTotal, lucro) {
    const custoDisplay = document.getElementById('custoTotalDisplay');
    const lucroDisplay = document.getElementById('lucroDisplay');

    if (custoDisplay) {
        custoDisplay.innerText = `R$ ${custoTotal.toFixed(2).replace('.', ',')}`;
    }
    
    if (lucroDisplay) {
        lucroDisplay.innerText = `R$ ${lucro.toFixed(2).replace('.', ',')}`;
        // Feedback visual: Vermelho para prejuízo, Verde para lucro
        lucroDisplay.style.color = lucro < 0 ? 'var(--danger)' : 'var(--success)';
    }
}

// Lógica 1: Calcula o Preço de Venda quando o usuário altera Custo, Frete ou Margem
function calcularPelaMargem() {
    const custo = getValorNumero('custo');
    const extras = getValorNumero('custosExtras');
    const margem = getValorNumero('margem');

    const custoTotal = custo + extras;
    const lucro = custoTotal * (margem / 100);
    const venda = custoTotal + lucro;

    // Atualiza o input de Venda APENAS se o usuário não estiver digitando nele
    if (document.activeElement.id !== 'venda') {
        document.getElementById('venda').value = venda > 0 ? venda.toFixed(2) : '';
    }

    atualizarPaineisCalculadora(custoTotal, lucro);
}

// Lógica 2: Calcula a Margem reversa quando o usuário digita o Preço Final direto
function calcularPeloPrecoVenda() {
    const custo = getValorNumero('custo');
    const extras = getValorNumero('custosExtras');
    const venda = getValorNumero('venda');

    const custoTotal = custo + extras;
    const lucro = venda - custoTotal;
    let margem = 0;

    // Evita erro matemático de divisão por zero
    if (custoTotal > 0) {
        margem = (lucro / custoTotal) * 100;
    }

    // Atualiza o input de Margem APENAS se o usuário não estiver digitando nela
    if (document.activeElement.id !== 'margem') {
        document.getElementById('margem').value = margem.toFixed(2);
    }

    atualizarPaineisCalculadora(custoTotal, lucro);
}

/* ==========================================================================
   3. INICIALIZAÇÃO DE EVENTOS, UPLOAD E VALIDAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. GERENCIAMENTO DE UPLOAD VISUAL ---
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const uploadArea = this.parentElement;
                
                // Alteramos apenas os elementos de texto/ícone para não destruir o input
                const icon = uploadArea.querySelector('.upload-icon');
                const title = uploadArea.querySelector('p');
                const subtitle = uploadArea.querySelector('small');

                if(icon) {
                    icon.innerText = '✅';
                    icon.style.color = 'var(--success)';
                }
                if(title) {
                    title.innerText = file.name;
                    title.style.color = 'var(--success)';
                }
                if(subtitle) {
                    subtitle.innerText = 'Pronto para processamento';
                }
                
                console.log("Arquivo carregado com sucesso:", file.name);
            }
        });
    }

    // --- B. IMPEDIR ENVIO PADRÃO DO FORMULÁRIO ---
    const form = document.getElementById('produtoForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário pronto para ser salvo no banco de dados!');
        });
    }

    // --- C. VALIDAÇÃO PARA HABILITAR/DESABILITAR O BOTÃO SALVAR ---
    // Defina aqui os IDs dos campos que não podem ficar vazios
    const camposObrigatorios = ['nome', 'sku', 'venda'];
    const btnSalvar = document.getElementById('btnSalvar');

    function verificarPreenchimento() {
        let todosPreenchidos = true;

        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            // Se o campo não existir ou estiver vazio (ignorando espaços), falha
            if (!campo || campo.value.trim() === '') {
                todosPreenchidos = false;
            }
        });

        // Atualiza o estado do botão (true desabilita, false habilita)
        if(btnSalvar) {
            btnSalvar.disabled = !todosPreenchidos;
        }
    }

    // Escuta eventos de digitação para checar a validação em tempo real
    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', verificarPreenchimento);
        }
    });

    // Executa a verificação uma vez ao carregar a página
    // (Garante que o botão inicie desabilitado se os campos estiverem vazios)
    verificarPreenchimento();
});