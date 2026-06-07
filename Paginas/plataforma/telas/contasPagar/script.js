let contas = JSON.parse(localStorage.getItem('contas')) || [];

const renderizar = () => {
    const tbody = document.getElementById('lista-contas');
    tbody.innerHTML = '';
    let pendente = 0, pago = 0;

    contas.forEach((c, index) => {
        if(c.paga) pago += c.valor; else pendente += c.valor;
        
        tbody.innerHTML += `
            <tr>
                <td>${c.descricao}</td>
                <td>R$ ${c.valor.toFixed(2)}</td>
                <td>${c.vencimento}</td>
                <td><span class="badge" style="background:${c.paga ? '#10b98133' : '#ef444433'}">${c.paga ? 'Pago' : 'Pendente'}</span></td>
                <td style="text-align: right;">
                    <button onclick="alternar(${index})" style="background:var(--primary); color:white; border:none; padding:5px 10px; border-radius:4px;">${c.paga ? 'Desfazer' : 'Pagar'}</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('total-pendente').innerText = `R$ ${pendente.toFixed(2)}`;
    document.getElementById('total-pago').innerText = `R$ ${pago.toFixed(2)}`;
};

document.getElementById('form-conta').onsubmit = (e) => {
    e.preventDefault();
    contas.push({
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        vencimento: document.getElementById('vencimento').value,
        paga: false
    });
    localStorage.setItem('contas', JSON.stringify(contas));
    renderizar();
    e.target.reset();
};

window.alternar = (i) => { contas[i].paga = !contas[i].paga; localStorage.setItem('contas', JSON.stringify(contas)); renderizar(); };
renderizar();