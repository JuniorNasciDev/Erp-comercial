

function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}


function checkSelection() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const bulkActions = document.getElementById('bulk-actions');
    let selectedCount = 0;
    checkboxes.forEach(cb => { if (cb.checked) selectedCount++; });

    bulkActions.style.display = selectedCount > 0 ? 'flex' : 'none';
}

function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    checkSelection();
}


    function toggleDropdown() {
        const menu = document.getElementById('entrada-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
    // Fecha o menu se clicar fora
    window.onclick = function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            document.getElementById('entrada-menu').style.display = 'none';
        }
    }
