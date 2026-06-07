document.addEventListener("DOMContentLoaded", () => {
    // Referências HTML
    const formEmissao = document.getElementById("form-emissao");
    const blocoBusca = document.getElementById("bloco-busca");
    const inputBusca = document.getElementById("input-busca");
    const btnBuscar = document.getElementById("btn-buscar");
    const msgBusca = document.getElementById("msg-busca");
    
    const tabelaItens = document.querySelector("#tabela-itens-venda tbody");
    const inputFrete = document.getElementById("valor_frete");
    const inputDesconto = document.getElementById("valor_desconto");
    const btnEmitir = document.getElementById("btn-emitir");
    const statusBadge = document.getElementById("status-nfe");
    const headerSubtitle = document.getElementById("header-subtitle");

    // Modal
    const modal = document.getElementById("modal-tributacao");
    const btnFecharModal = document.getElementById("btn-fechar-modal");
    const btnSalvarModal = document.getElementById("btn-salvar-modal");
    
    let pedidoItens = [];
    let indexProdutoAtual = null;

    // ==========================================
    // SIMULAÇÃO DO BANCO DE DADOS DE PEDIDOS
    // ==========================================
    const bancoDeDadosPedidos = {
        "8492": {
            cliente: { razao: "Tech Solutions LTDA", cnpj: "12.345.678/0001-99", ie: "123.456.789.123" },
            frete: 50.00, desconto: 0.00,
            itens: [
                { id: 1, cod: "PRD-001", nome: "Teclado Mecânico RGB", un: "UN", qtd: 2, valor_unit: 350.00, ncm: "84716052", cest: "", cfop: "5102", origem: "1", csosn: "102", aliq_icms: 0, pis_cofins: "49" },
                { id: 2, cod: "PRD-002", nome: "Mouse Gamer Sem Fio", un: "UN", qtd: 1, valor_unit: 280.00, ncm: "", cest: "", cfop: "5102", origem: "0", csosn: "102", aliq_icms: 0, pis_cofins: "49" } // Item com erro intencional
            ]
        },
        "1050": {
            cliente: { razao: "Comercial Silva EIRELI", cnpj: "98.765.432/0001-11", ie: "ISENTO" },
            frete: 0.00, desconto: 50.00,
            itens: [
                { id: 3, cod: "PRD-009", nome: "Monitor Ultrawide 29", un: "UN", qtd: 1, valor_unit: 1200.00, ncm: "85285200", cest: "", cfop: "5102", origem: "0", csosn: "101", aliq_icms: 18, pis_cofins: "01" }
            ]
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // ==========================================
    // LÓGICA DE BUSCA DO PEDIDO
    // ==========================================
    btnBuscar.addEventListener("click", () => {
        const numPedido = inputBusca.value.trim();
        const pedidoEncontrado = bancoDeDadosPedidos[numPedido];

        if (pedidoEncontrado) {
            // Sucesso! Esconde mensagem de erro e preenche tela
            msgBusca.style.display = "none";
            
            // Preenche dados do cliente
            document.getElementById("cli_razao").value = pedidoEncontrado.cliente.razao;
            document.getElementById("cli_cnpj").value = pedidoEncontrado.cliente.cnpj;
            document.getElementById("cli_ie").value = pedidoEncontrado.cliente.ie;
            
            // Preenche frete e desconto
            inputFrete.value = pedidoEncontrado.frete.toFixed(2);
            inputDesconto.value = pedidoEncontrado.desconto.toFixed(2);
            
            // Carrega itens na variável principal e renderiza
            pedidoItens = JSON.parse(JSON.stringify(pedidoEncontrado.itens)); // Clona o array
            renderizarTabela();

            // Atualiza cabeçalho e esconde a barra de busca
            headerSubtitle.innerHTML = `Faturamento referente ao <strong class="text-highlight">Pedido #${numPedido}</strong>`;
            statusBadge.textContent = "Em Digitação";
            blocoBusca.classList.add("hidden-section");
            
            // Mostra o formulário de NFe e o botão de emitir
            formEmissao.classList.remove("hidden-section");
            btnEmitir.classList.remove("hidden-section");
            
        } else {
            // Falha
            msgBusca.style.display = "block";
            msgBusca.textContent = "⚠️ Pedido não encontrado no sistema.";
        }
    });

    // Permite apertar "Enter" na busca
    inputBusca.addEventListener("keypress", (e) => {
        if (e.key === "Enter") btnBuscar.click();
    });

    // ==========================================
    // VALIDADOR FISCAL E RENDERIZAÇÃO (Já feitos antes)
    // ==========================================
    const validarItem = (item) => {
        let erros = [];
        if (!item.ncm || item.ncm.length < 8) erros.push("NCM Inválido");
        if (!item.cfop || item.cfop.length < 4) erros.push("CFOP Inválido");
        if (item.qtd <= 0) erros.push("Qtd deve ser maior que 0");
        if (item.valor_unit <= 0) erros.push("Valor Zerado");
        return erros;
    };

    const renderizarTabela = () => {
        tabelaItens.innerHTML = "";
        let totalProdutos = 0;
        let temAlgumErroNaNota = false;

        pedidoItens.forEach((item, index) => {
            const tr = document.createElement("tr");
            const valorTotal = item.qtd * item.valor_unit;
            totalProdutos += valorTotal;

            const errosDoItem = validarItem(item);
            if (errosDoItem.length > 0) {
                tr.classList.add("row-error");
                temAlgumErroNaNota = true;
            }

            const mensagemErroHTML = errosDoItem.length > 0 
                ? `<span class="error-msg">⚠️ Faltam dados: ${errosDoItem.join(", ")}</span>` 
                : `<span class="text-muted" style="font-size: 0.75rem; color: var(--primary);">NCM: ${item.ncm} | CFOP: ${item.cfop}</span>`;

            tr.innerHTML = `
                <td>
                    <strong>${item.cod}</strong><br>
                    <span class="text-muted" style="font-size: 0.85rem">${item.nome}</span><br>
                    ${mensagemErroHTML}
                </td>
                <td>${item.un}</td>
                <td><input type="number" class="input-qtd input-pequeno" data-index="${index}" value="${item.qtd}" min="1" step="1"></td>
                <td><input type="number" class="input-vl input-pequeno" data-index="${index}" value="${item.valor_unit.toFixed(2)}" min="0" step="0.01"></td>
                <td><strong>${formatCurrency(valorTotal)}</strong></td>
                <td class="actions-cell">
                    <button type="button" class="btn-icon btn-impostos" data-index="${index}" title="Ajustar Tributação">⚙️ Fisco</button>
                    <button type="button" class="btn-icon btn-remover" data-index="${index}" title="Remover da Nota">X</button>
                </td>
            `;
            tabelaItens.appendChild(tr);
        });

        // Listeners das linhas dinâmicas
        document.querySelectorAll(".input-qtd").forEach(input => {
            input.addEventListener("input", (e) => { pedidoItens[e.target.dataset.index].qtd = parseFloat(e.target.value) || 0; renderizarTabela(); });
        });
        document.querySelectorAll(".input-vl").forEach(input => {
            input.addEventListener("input", (e) => { pedidoItens[e.target.dataset.index].valor_unit = parseFloat(e.target.value) || 0; renderizarTabela(); });
        });
        document.querySelectorAll(".btn-impostos").forEach(btn => {
            btn.addEventListener("click", (e) => abrirModal(e.target.dataset.index));
        });
        document.querySelectorAll(".btn-remover").forEach(btn => {
            btn.addEventListener("click", (e) => { pedidoItens.splice(e.target.dataset.index, 1); renderizarTabela(); });
        });

        calcularFechamento(totalProdutos);
        
        btnEmitir.disabled = temAlgumErroNaNota;
        if (temAlgumErroNaNota) btnEmitir.title = "Corrija os itens em vermelho antes de emitir";
        else btnEmitir.title = "";
    };

    const calcularFechamento = (totalProdutos) => {
        const frete = parseFloat(inputFrete.value) || 0;
        const desconto = parseFloat(inputDesconto.value) || 0;
        const totalNota = (totalProdutos - desconto) + frete;
        document.getElementById("total_nfe").textContent = formatCurrency(totalNota < 0 ? 0 : totalNota);
    };

    // ==========================================
    // LÓGICA DO MODAL FISCAL
    // ==========================================
    const abrirModal = (index) => {
        indexProdutoAtual = index;
        const item = pedidoItens[index];

        document.getElementById("modal-titulo-produto").textContent = `Impostos: ${item.cod}`;
        document.getElementById("modal_ncm").value = item.ncm;
        document.getElementById("modal_cest").value = item.cest;
        document.getElementById("modal_cfop").value = item.cfop;
        document.getElementById("modal_origem").value = item.origem;
        document.getElementById("modal_csosn").value = item.csosn;
        document.getElementById("modal_aliq_icms").value = item.aliq_icms;
        document.getElementById("modal_pis_cofins").value = item.pis_cofins;

        modal.classList.remove("hidden-section");
    };

    btnFecharModal.addEventListener("click", () => { modal.classList.add("hidden-section"); indexProdutoAtual = null; });

    btnSalvarModal.addEventListener("click", () => {
        if (indexProdutoAtual !== null) {
            pedidoItens[indexProdutoAtual].ncm = document.getElementById("modal_ncm").value;
            pedidoItens[indexProdutoAtual].cest = document.getElementById("modal_cest").value;
            pedidoItens[indexProdutoAtual].cfop = document.getElementById("modal_cfop").value;
            pedidoItens[indexProdutoAtual].origem = document.getElementById("modal_origem").value;
            pedidoItens[indexProdutoAtual].csosn = document.getElementById("modal_csosn").value;
            pedidoItens[indexProdutoAtual].aliq_icms = parseFloat(document.getElementById("modal_aliq_icms").value) || 0;
            pedidoItens[indexProdutoAtual].pis_cofins = document.getElementById("modal_pis_cofins").value;
            
            modal.classList.add("hidden-section");
            renderizarTabela(); 
        }
    });

    // ==========================================
    // EMISSÃO E EVENTOS GERAIS
    // ==========================================
    inputFrete.addEventListener("input", renderizarTabela);
    inputDesconto.addEventListener("input", renderizarTabela);

    btnEmitir.addEventListener("click", () => {
        if (pedidoItens.length === 0) return alert("Não é possível emitir nota sem produtos.");
        
        btnEmitir.innerHTML = `<span class="loader"></span> Transmitindo Sefaz...`;
        btnEmitir.disabled = true;

        setTimeout(() => {
            btnEmitir.innerHTML = `NFe Emitida!`;
            btnEmitir.style.background = "var(--success)";
            statusBadge.textContent = "Autorizada";
            statusBadge.className = "badge success"; // substitui classe warning por success
            document.querySelectorAll("input, select, button.btn-remover, button.btn-impostos").forEach(el => el.disabled = true);
        }, 2500);
    });
});