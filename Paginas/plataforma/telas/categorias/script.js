
function tentarExcluirCategoria(nome, qtdProdutos) {
    if (qtdProdutos > 0) {
        alert("⚠️ Ação Bloqueada: A categoria '" + nome + "' possui " + qtdProdutos + " produtos vinculados. Mova os produtos antes de excluir.");
    } else {
        if(confirm("Tem certeza que deseja excluir a categoria '" + nome + "'?")) {
            // Lógica de exclusão aqui
            console.log("Categoria excluída");
        }
    }
}

function acaoExcluir(nome, qtdProdutos) {
    if (qtdProdutos > 0) {
        // Exibe um alerta explicativo em vez do modal de exclusão
        alert("Ação não permitida: A categoria '" + nome + "' possui " + qtdProdutos + " produtos vinculados. Mova-os para outra categoria antes.");
    } else {
        // Se qtd == 0, abre o modal de exclusão real
        abrirModal('modal-excluir-categoria');
    }
}