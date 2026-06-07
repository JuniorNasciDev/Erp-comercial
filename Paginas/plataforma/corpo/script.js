window.addEventListener("DOMContentLoaded", () => {
  const appEl = document.querySelector(".app");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const themeToggle = document.getElementById("themeToggle");
  const compactToggle = document.getElementById("compactToggle");
  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const viewTitle = document.getElementById("viewTitle");
  const iframeF = document.querySelector("#corp-page"); 

  iframeF.src = "../telas/Dashboard/index.html"

  

  const views = {
    overview: document.getElementById("viewDashboard"),
    analytics: document.getElementById("viewAnalytics"),
    sales: document.getElementById("viewSales"),
    projects: document.getElementById("viewProjects"),
    team: document.getElementById("viewTeam"),
  };

  function setTheme(mode) {
    appEl.setAttribute("data-theme", mode);
    themeToggle.textContent = mode === "light" ? "☀️" : "🌙";
    try {
      localStorage.setItem("bossDashboardTheme", mode);
    } catch (e) { }
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem("bossDashboardTheme");
    } catch (e) { }
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      setTheme("dark");
    }
  }

  function setCompact(enabled) {
    appEl.setAttribute("data-compact", enabled ? "true" : "false");
  }

  function setView(viewKey) {
    Object.entries(views).forEach(([key, el]) => {
      if (!el) return;
      if (key === viewKey) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });

    navItems.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewKey);
    });

    const labelMap = {
      overview: "Dashboard",
      analytics: "Analytics",
      sales: "Sales",
      projects: "Projects",
      team: "Team",
    };
    viewTitle.textContent = labelMap[viewKey] || "Dashboard";
  }

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  themeToggle.addEventListener("click", () => {
    const isDark = appEl.getAttribute("data-theme") !== "light";
    setTheme(isDark ? "light" : "dark");
  });

  compactToggle.addEventListener("click", () => {
    const compact = appEl.getAttribute("data-compact") === "true";
    setCompact(!compact);
  });

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewKey = btn.dataset.view;
      setView(viewKey);
    });
  });

  initTheme();
  setCompact(false);
  setView("overview");
});

function sairSistema() {
  window.location.replace("../../login/minimal/index.html")
}

function mudarBtnAtivo() {
  // 1. Selecionamos os botões e o nosso Iframe
  const botoes = document.querySelectorAll(".nav-item");
  const iframe = document.querySelector("#corp-page"); 

  // Trava de segurança: Se o iframe não existir na tela, avisa no console e para o código
  if (!iframe) {
    console.error("Erro: Iframe 'corp-page' não encontrado no HTML.");
    return;
  }

  botoes.forEach(function(botao) {
    botao.addEventListener("click", function() {

      // --- PARTE 1: TROCA A COR DO BOTÃO ---
      botoes.forEach(function(item) {
        item.classList.remove("active");
      });
      this.classList.add("active");

      // --- PARTE 2: TROCA A TELA DO IFRAME ---
      const caminhoDaTela = this.getAttribute("data-url");
      // Isso vai imprimir no seu navegador o que o JavaScript está "enxergando"
console.log("O botão clicado mandou abrir o link:", caminhoDaTela);
      if (caminhoDaTela) {
        iframe.src = caminhoDaTela;
      }

    });
  });
}


// 2. A CORREÇÃO ESTÁ AQUI:
// Dizemos ao navegador: "Assim que terminar de ler o HTML, execute a função mudarBtnAtivo!"
document.addEventListener("DOMContentLoaded", mudarBtnAtivo);
// Inicia a função assim que a página carrega







