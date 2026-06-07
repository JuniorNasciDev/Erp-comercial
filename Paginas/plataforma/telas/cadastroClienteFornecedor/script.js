document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos de Aba (Tabs)
    const tabCliente = document.getElementById('tabCliente');
    const tabFornecedor = document.getElementById('tabFornecedor');
    const telaCliente = document.getElementById('telaCliente');
    const telaFornecedor = document.getElementById('telaFornecedor');

    // Botões de Ação
    const btnLimpar = document.getElementById('btnLimpar');
    const btnSalvar = document.getElementById('btnSalvar');
    const inputCep = document.getElementById('cep');

    // Eventos das Abas
    tabCliente.addEventListener('click', () => alternarTela('cliente'));
    tabFornecedor.addEventListener('click', () => alternarTela('fornecedor'));

    // Eventos de mudança de Pessoa Física / Jurídica
    const radiosCliente = document.querySelectorAll('input[name="tipoPessoaCli"]');
    const radiosFornecedor = document.querySelectorAll('input[name="tipoPessoaFor"]');
    
    radiosCliente.forEach(radio => {
        radio.addEventListener('change', () => ajustarTipoPessoa('Cli'));
    });

    radiosFornecedor.forEach(radio => {
        radio.addEventListener('change', () => ajustarTipoPessoa('For'));
    });

    // Ações dos botões e campos
    btnLimpar.addEventListener('click', limparFormulario);
    btnSalvar.addEventListener('click', salvarCadastro);
    inputCep.addEventListener('blur', (e) => buscarCep(e.target.value));

    // --- FUNÇÕES ---

    function alternarTela(tipo) {
        if (tipo === 'cliente') {
            telaCliente.classList.remove('hidden');
            telaFornecedor.classList.add('hidden');
            tabCliente.classList.add('active');
            tabFornecedor.classList.remove('active');
        } else {
            telaFornecedor.classList.remove('hidden');
            telaCliente.classList.add('hidden');
            tabFornecedor.classList.add('active');
            tabCliente.classList.remove('active');
        }
    }

    function ajustarTipoPessoa(contexto) {
        // Encontra qual rádio está selecionado no contexto atual
        const radioSelecionado = document.querySelector(`input[name="tipoPessoa${contexto}"]:checked`).value;
        const labelNome = document.getElementById(`lblNome${contexto}`);
        const labelDoc = document.getElementById(`lblDoc${contexto}`);
        const inputDoc = document.getElementById(`doc${contexto}`);

        if (radioSelecionado === 'PF') {
            labelNome.innerHTML = `Nome Completo <span class="required">*</span>`;
            labelDoc.innerHTML = `CPF <span class="required">*</span>`;
            inputDoc.placeholder = "Apenas números";
        } else {
            labelNome.innerHTML = `Razão Social <span class="required">*</span>`;
            labelDoc.innerHTML = `CNPJ <span class="required">*</span>`;
            inputDoc.placeholder = "00.000.000/0000-00";
        }
    }

    function limparFormulario() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => input.value = '');
    }

    function salvarCadastro() {
        // Verifica qual tela está ativa para saber o que está sendo salvo
        const tipoAtivo = telaCliente.classList.contains('hidden') ? 'Fornecedor' : 'Cliente';
        alert(`${tipoAtivo} salvo com sucesso!`);
        // Aqui você faria o POST para o backend
    }

    function buscarCep(cep) {
        if(cep.length >= 8) {
            console.log(`Buscando dados para o CEP: ${cep}`);
            // Aqui entra a lógica da API ViaCEP
        }
    }
});


const btnCliente = document.getElementById('tabCliente');
const btnFornecedor = document.getElementById('tabFornecedor');

// Quando clicar em Cliente
btnCliente.addEventListener('click', () => {
    // Liga o botão Cliente, desliga Fornecedor
    btnCliente.classList.add('active');
    btnFornecedor.classList.remove('active');
    
    // (Aqui vai o seu código existente para mostrar a div do formulário)
});

// Quando clicar em Fornecedor
btnFornecedor.addEventListener('click', () => {
    // Liga o botão Fornecedor, desliga Cliente
    btnFornecedor.classList.add('active');
    btnCliente.classList.remove('active');
    
    // (Aqui vai o seu código existente para mostrar a div do formulário)
});