document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LÓGICA DE NAVEGAÇÃO DAS ABAS (TABS)
    // ==========================================
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove a classe ativa de todos os botões e abas
                tabBtns.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.classList.remove("active"));
                
                // Adiciona a classe ativa apenas no botão clicado e na aba correspondente
                btn.classList.add("active");
                const targetId = btn.getAttribute("data-target");
                const targetContent = document.getElementById(targetId);
                
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }

    // ==========================================
    // 2. BUSCA DE CEP AUTOMÁTICA (ViaCEP)
    // ==========================================
    const inputCep = document.getElementById("cep");
    const inputEndereco = document.getElementById("endereco");
    
    if (inputCep) {
        inputCep.addEventListener("blur", async (e) => {
            let cep = e.target.value.replace(/\D/g, ''); 
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro && inputEndereco) {
                        // Preenche o campo de endereço completo no formato padrão
                        inputEndereco.value = `${data.logradouro}, Número, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                        inputEndereco.focus(); // Coloca o cursor para o usuário digitar o número
                    } else if (data.erro) {
                        alert("CEP não encontrado. Por favor, verifique os números digitados.");
                    }
                } catch (error) { 
                    console.error("Erro ao buscar CEP:", error); 
                }
            }
        });
    }

    // ==========================================
    // 3. UPLOAD E VALIDAÇÃO DE CERTIFICADO DIGITAL
    // ==========================================
    const dropZone = document.getElementById("drop-zone");
    const certInput = document.getElementById("certificado_file");
    const fileNameSpan = document.getElementById("file-name");
    const btnValidar = document.getElementById("btn-validar-cert");
    const statusCert = document.getElementById("status-certificado");
    const inputSenha = document.getElementById("senha_certificado");

    if (dropZone && certInput) {
        // Atualiza o nome quando o usuário clica e seleciona o arquivo
        certInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                fileNameSpan.textContent = e.target.files[0].name;
                fileNameSpan.style.color = "var(--text-main)";
            }
        });

        // Efeitos visuais para arrastar e soltar (Drag and Drop)
        dropZone.addEventListener("dragover", (e) => { 
            e.preventDefault(); 
            dropZone.classList.add("dragover"); 
        });
        
        dropZone.addEventListener("dragleave", () => { 
            dropZone.classList.remove("dragover"); 
        });
        
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                certInput.files = e.dataTransfer.files;
                fileNameSpan.textContent = e.dataTransfer.files[0].name;
                fileNameSpan.style.color = "var(--text-main)";
            }
        });

        // Simulação da validação da senha com a Sefaz
        if (btnValidar) {
            btnValidar.addEventListener("click", () => {
                if (!certInput.files.length) return alert("Por favor, anexe o arquivo do certificado (.pfx) primeiro.");
                if (!inputSenha.value) return alert("Por favor, digite a senha do certificado.");

                btnValidar.innerHTML = "<span class='loader'></span> Validando Sefaz...";
                btnValidar.style.opacity = "0.7";
                btnValidar.disabled = true;

                setTimeout(() => {
                    btnValidar.textContent = "Certificado Atualizado";
                    btnValidar.style.background = "var(--success)";
                    btnValidar.style.borderColor = "var(--success)";
                    btnValidar.style.color = "white";
                    btnValidar.style.opacity = "1";
                    
                    if(statusCert) {
                        statusCert.textContent = "Válido até 07/06/2027";
                        statusCert.className = "badge success";
                    }
                }, 2000);
            });
        }
    }

    // ==========================================
    // 4. LÓGICA DO MODAL (NOVO USUÁRIO E FLAGS)
    // ==========================================
    const modalUsuario = document.getElementById("modal-usuario");
    const btnAbrirModalUser = document.getElementById("btn-abrir-modal-usuario");
    const btnFecharModalUser = document.getElementById("btn-fechar-modal-usuario");
    const btnEnviarConvite = document.getElementById("btn-enviar-convite");

    if (modalUsuario) {
        // Abrir Modal
        if (btnAbrirModalUser) {
            btnAbrirModalUser.addEventListener("click", () => {
                modalUsuario.classList.remove("hidden-section");
            });
        }

        // Fechar Modal
        if (btnFecharModalUser) {
            btnFecharModalUser.addEventListener("click", () => {
                modalUsuario.classList.add("hidden-section");
            });
        }

        // Processo de envio de convite com validação
        if (btnEnviarConvite) {
            btnEnviarConvite.addEventListener("click", () => {
                const nome = document.getElementById("novo_user_nome").value;
                const email = document.getElementById("novo_user_email").value;

                if(!nome || !email) {
                    alert("Por favor, preencha o nome e o e-mail do colaborador.");
                    return;
                }

                btnEnviarConvite.innerHTML = "<span class='loader'></span> Enviando Convite...";
                btnEnviarConvite.disabled = true;

                // Simula o tempo de envio do e-mail
                setTimeout(() => {
                    alert(`Convite enviado com sucesso para ${email}! O colaborador deve acessar a caixa de entrada para definir a senha e aceitar as permissões (Flags) que você configurou.`);
                    
                    // Restaura o botão e fecha o modal
                    btnEnviarConvite.innerHTML = "Enviar Convite";
                    btnEnviarConvite.disabled = false;
                    modalUsuario.classList.add("hidden-section");
                    
                    // Limpa os campos para o próximo cadastro
                    document.getElementById("novo_user_nome").value = "";
                    document.getElementById("novo_user_email").value = "";
                }, 1500);
            });
        }
    }

    // ==========================================
    // 5. TESTAR CONEXÃO DO GATEWAY
    // ==========================================
    // Corrigido: Movido para dentro do escopo seguro do DOMContentLoaded
    const btnGateway = document.getElementById('btn-testar-gateway');
    const statusText = document.getElementById('gateway-status-text');
    const badge = document.getElementById('status-gateway');
    
    if (btnGateway) {
        btnGateway.addEventListener('click', function() {
            btnGateway.innerHTML = '<span class="loader"></span> Testando...';
            btnGateway.disabled = true;

            setTimeout(() => {
                btnGateway.innerHTML = 'Testar Conexão';
                btnGateway.disabled = false;
                
                // Simulação de sucesso com checagem de elementos
                if (statusText) {
                    statusText.textContent = "✅ Conexão estabelecida com sucesso!";
                    statusText.style.color = "var(--success)";
                }
                if (badge) {
                    badge.textContent = "Ativo";
                    badge.className = "badge success";
                }
            }, 1500);
        });
    }
});

// ==========================================
// 6. FUNÇÃO GLOBAL: UPGRADE DE PLANO
// ==========================================
// Mantida fora do DOMContentLoaded pois é disparada via atributo 'onclick' direto nas tags HTML
window.simularUpgrade = function(buttonElement) {
    buttonElement.innerHTML = "<span class='loader'></span> Processando...";
    buttonElement.disabled = true;

    setTimeout(() => {
        buttonElement.innerHTML = "✅ Upgrade Concluído";
        buttonElement.classList.remove("btn-secundario");
        buttonElement.classList.add("btn-salvar");
        
        alert("Parabéns! Seu plano foi atualizado para o ENTERPRISE. Todos os módulos foram liberados e sua fatura foi ajustada para o próximo ciclo.");
    }, 2500);
};


