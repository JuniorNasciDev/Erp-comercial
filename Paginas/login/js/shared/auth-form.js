// Esta estrutura "(function () { ... })();" é chamada de IIFE (Immediately Invoked Function Expression).
// Ela serve para criar uma "bolha" isolada. Assim, as variáveis criadas aqui dentro 
// não entram em conflito com outros scripts do seu ERP.
(function () {
  
  // 1. CAPTURA DOS ELEMENTOS DA TELA
  // Procura no HTML o formulário que tenha o atributo "data-auth-form"
  const form = document.querySelector("[data-auth-form]");
  
  // Se não encontrar o formulário (ex: o script carregou numa página que não tem login), 
  // ele para a execução aqui mesmo para não gerar erros no console.
  if (!form) return;

  // Busca os campos de email, senha e a caixa (banner) onde as mensagens de erro vão aparecer
  const emailEl = form.querySelector('input[name="email"]');
  const passEl = form.querySelector('input[name="password"]');
  const banner = form.querySelector("[data-form-message]");
  
  // Expressão Regular (Regex) para validar o formato do e-mail. 
  // Basicamente, ela checa se existe texto, seguido de um "@", seguido de texto, um ponto ".", e mais texto.
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 2. DICIONÁRIO DE MENSAGENS
  // Um objeto que guarda os textos de erro e sucesso em Português e Inglês.
  const MSG = {
    pt: {
      emptyEmail: "Por favor, insira o seu e-mail.",
      badEmail: "Formato de e-mail inválido.",
      emptyPass: "Por favor, insira a sua senha.",
      shortPass: "A senha deve ter pelo menos 8 caracteres (regra de demonstração).",
      ok: "Validado localmente — esta demonstração não se conecta a um servidor.",
    },
    en: {
      emptyEmail: "Please enter your email.",
      badEmail: "Invalid email format.",
      emptyPass: "Please enter your password.",
      shortPass: "Password must be at least 8 characters (demo rule).",
      ok: "Validated locally — this demo does not connect to a server.",
    },
  };

  // 3. FUNÇÕES DE APOIO

  // Função que descobre qual idioma a página está usando no momento, 
  // lendo o atributo lang="..." lá na tag <html> do topo do documento.
  function lang() {
    return document.documentElement.lang === "en" ? "en" : "pt";
  }

  // Função "tradutora". Você passa uma chave (ex: "badEmail") e ela retorna 
  // o texto correto de acordo com o idioma atual que a função lang() descobriu.
  function t(key) {
    return MSG[lang()][key] || "";
  }

  // Função responsável por exibir ou esconder a mensagem de alerta na tela.
  function showMessage(text, isError) {
    if (!banner) return; // Se não existir a caixa de mensagem no HTML, não faz nada
    
    banner.textContent = text; // Coloca o texto dentro da caixa
    banner.hidden = !text; // Se não tiver texto nenhum, ele esconde a caixa. Se tiver, ele mostra.
    
    // Se for um erro E tiver texto, ele adiciona a classe CSS "is-error" (que deve deixar vermelho). 
    // Se não for erro, ele remove a classe (deixando verde/neutro).
    banner.classList.toggle("is-error", Boolean(isError && text));
    
    // Acessibilidade: avisa leitores de tela para pessoas com deficiência visual se aquilo é um alerta importante.
    banner.setAttribute("role", text ? "alert" : "presentation");
  }

  // Função de limpeza (sanitização). 
  function sanitize(str) {
    return String(str ?? "") // Garante que o valor é um texto (string)
      .trim() // Remove espaços em branco que o usuário digitou sem querer no começo ou no final
      .slice(0, 320); // Corta o texto para ter no máximo 320 caracteres (evita travamentos)
  }

  // 4. LÓGICA PRINCIPAL DE VALIDAÇÃO
  function runValidation() {
    showMessage("", false); // Começa limpando qualquer mensagem de erro anterior da tela

    // Pega o que o usuário digitou e passa pela função de limpeza
    const email = sanitize(emailEl?.value);
    const password = sanitize(passEl?.value);

    // Devolve o texto limpo para os campos (assim, se ele digitou "  email@teste.com  ", o campo atualiza tirando os espaços)
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = password;

    // Sequência de testes:
    // Se o email estiver vazio, mostra erro, joga o cursor de volta pro campo de email e para (return)
    if (!email) {
      showMessage(t("emptyEmail"), true);
      emailEl?.focus();
      return; 
    }
    // Se o email não passar no teste da Regex (não tiver @ ou .), mostra erro e para
    if (!emailRe.test(email)) {
      showMessage(t("badEmail"), true);
      emailEl?.focus();
      return;
    }
    // Se a senha estiver vazia, mostra erro e para
    if (!password) {
      showMessage(t("emptyPass"), true);
      passEl?.focus();
      return;
    }
    // Se a senha tiver menos de 8 caracteres, mostra erro e para
    if (password.length < 8) {
      showMessage(t("shortPass"), true);
      passEl?.focus();
      return;
    }

    // Se o código chegou até aqui sem cair em nenhum dos "return" acima, 
    // significa que passou em todos os testes! Então, exibe a mensagem de sucesso (isError = false).
    showMessage(t("ok"), false);
    
    // NOTA PARA O SEU ERP: É EXATAMENTE AQUI que você futuramente apagará o "showMessage(t('ok'))"
    // e colocará o código (como o 'fetch' ou 'axios') para enviar o email e senha para o seu Back-end/Banco de Dados!
  }

  // 5. GATILHO DE EXECUÇÃO
  // Fica "escutando" o momento em que o usuário clica no botão de submit ou aperta Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o comportamento padrão do navegador de recarregar a página inteira
    window.location.href = "../../plataforma/corpo/index.html"
   // runValidation(); // Chama a nossa função principal que faz as validações
  });
  
})();