// Referências aos elementos do DOM
const dtInicio = document.getElementById('dataInicio');
const dtFim = document.getElementById('dataFim');
const statusNota = document.getElementById('statusNota');
const btnFiltrar = document.getElementById('btnFiltrar');

const elFaturado = document.getElementById('totalFaturado');
const elNfe = document.getElementById('totalNFe');
const elCanceladas = document.getElementById('totalCanceladas');
const elImpostos = document.getElementById('totalImpostos');
const btnExportar = document.getElementById('btnExportar');

// Função para formatar moeda
const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Simulação de busca no Banco de Dados baseada nas datas
function simularBuscaDeDados(inicio, fim, status) {
    // Na vida real, isso seria um fetch() para sua API passando as datas
    // Aqui estamos gerando números aleatórios apenas para mostrar a tela reagindo aos filtros
    
    // Converte datas para criar uma variação "falsa"
    const diaInicio = new Date(inicio).getDate() || 1;
    const diaFim = new Date(fim).getDate() || 30;
    const diasSelecionados = Math.abs(diaFim - diaInicio) + 1;

    let nfeBase = diasSelecionados * 5; 
    let canceladasBase = Math.floor(nfeBase * 0.05);
    let faturamentoBase = nfeBase * 310.50;

    // Aplica o filtro de status na simulação
    if (status === 'autorizadas') {
        canceladasBase = 0;
    } else if (status === 'canceladas') {
        nfeBase = canceladasBase;
        faturamentoBase = 0; // Notas canceladas não geram faturamento
    }

    const impostosBase = faturamentoBase * 0.06; // Simula 6% de imposto

    // Atualiza a tela
    elNfe.textContent = nfeBase;
    elCanceladas.textContent = canceladasBase;
    elFaturado.textContent = formatarMoeda(faturamentoBase);
    elImpostos.textContent = formatarMoeda(impostosBase);
}

// Evento do botão Aplicar Filtros
btnFiltrar.addEventListener('click', () => {
    const inicio = dtInicio.value;
    const fim = dtFim.value;
    
    if (inicio > fim) {
        alert("A Data Inicial não pode ser maior que a Data Final.");
        return;
    }

    btnFiltrar.textContent = "Buscando...";
    
    // Simula um delay de rede
    setTimeout(() => {
        simularBuscaDeDados(inicio, fim, statusNota.value);
        btnFiltrar.textContent = "Aplicar Filtros";
    }, 500);
});

// Evento do botão de exportação
btnExportar.addEventListener('click', function() {
    const inicioArr = dtInicio.value.split('-');
    const fimArr = dtFim.value.split('-');
    const periodoFormatado = `${inicioArr[2]}/${inicioArr[1]} até ${fimArr[2]}/${fimArr[1]}`;
    
    const formato = document.querySelector('input[name="formato"]:checked').value;
    const incluiNfe = document.getElementById('chkNfe').checked;
    const incluiNfse = document.getElementById('chkNfse').checked;
    
    if(!incluiNfe && !incluiNfse) {
        alert("Atenção: Selecione ao menos um tipo de nota (NF-e ou NFS-e) para exportar os XMLs.");
        return;
    }

    btnExportar.textContent = "Compactando arquivos...";
    btnExportar.style.backgroundColor = "#64748b";
    
    // Simula o tempo de processamento
    setTimeout(() => {
        alert(`Sucesso!\nPacote contábil do período (${periodoFormatado})\nFormato: ${formato}\nO download começará em instantes.`);
        btnExportar.textContent = "Gerar Pacote Contábil do Período Selecionado";
        btnExportar.style.backgroundColor = "";
    }, 2000);
});