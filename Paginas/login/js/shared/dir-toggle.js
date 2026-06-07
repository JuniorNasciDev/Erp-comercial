(function () {
  const KEY_DIR = "premium-auth-dir";
  const KEY_LANG = "premium-auth-lang";

  // Como Inglês e Português são LTR (esquerda para a direita), a direção será sempre essa.
  function dirForLang(lang) {
    return "ltr";
  }

  function apply(dir, lang) {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(KEY_DIR, dir);
    localStorage.setItem(KEY_LANG, lang);
    window.dispatchEvent(new CustomEvent("premium-auth:locale", { detail: { dir, lang } }));
  }

  function initFromStorage() {
    // Tenta pegar o idioma do storage, do HTML, ou define 'pt' como idioma padrão
    let lang = localStorage.getItem(KEY_LANG) || document.documentElement.getAttribute("lang") || "pt";
    
    // Se não for 'en' nem 'pt', força a voltar para 'pt'
    if (lang !== "en" && lang !== "pt") lang = "pt";
    
    const dir = dirForLang(lang);
    apply(dir, lang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initFromStorage();

    // Botão para alternar o idioma principal (Inglês <-> Português)
    document.getElementById("js-lang-toggle")?.addEventListener("click", () => {
      const nextLang = document.documentElement.lang === "pt" ? "en" : "pt";
      const dir = dirForLang(nextLang);
      apply(dir, nextLang);
    });

    // Como não há mais mudança de "RTL" para "LTR", fiz o botão antigo de direção
    // também alternar o idioma, caso você não tenha apagado ele do seu HTML.
    document.getElementById("js-dir-toggle")?.addEventListener("click", () => {
      const nextLang = document.documentElement.lang === "pt" ? "en" : "pt";
      const dir = dirForLang(nextLang);
      apply(dir, nextLang);
    });
  });
})();