(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Header: dropdown Soluções
  $$('[data-mouseenter="openSol"]').forEach(function (el) {
    var dd = $('[data-if="solOpen"]', el);
    el.addEventListener('mouseenter', function () { dd && (dd.hidden = false); });
    el.addEventListener('mouseleave', function () { dd && (dd.hidden = true); });
  });

  // Header: menu mobile
  var menuBtn = $('[data-action="toggleMenu"]');
  var menu = $('[data-if="menuOpen"]');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.hidden = !open;
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 980) setMenu(false); });

  // FAQ
  var faqBtns = $$('[data-action="it.toggle"]');
  function setFaq(btn, open) {
    var ans = $('[data-if="it.open"][data-i="' + btn.dataset.i + '"]');
    if (ans) ans.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var icon = btn.lastElementChild;
    if (icon) icon.style.transform = open ? 'rotate(45deg)' : 'none';
  }
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      faqBtns.forEach(function (b) { setFaq(b, false); });
      setFaq(btn, open);
    });
  });

  // Home: abas de soluções
  var tabs = $$('[data-action="tab.select"]');
  if (tabs.length > 1) {
    var on = tabs[0].className, off = tabs[1].className;
    var cards = $$('[data-g]');
    var select = function (i) {
      tabs.forEach(function (t, j) { t.className = j === i ? on : off; t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = +c.dataset.g !== i; });
    };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { select(i); }); });
    select(0);
  }

  // Blog artigo: copiar link
  var copy = $('[data-action="copiar"]');
  if (copy) copy.addEventListener('click', function () {
    try { navigator.clipboard.writeText(location.href); } catch (e) {}
    var label = copy.textContent;
    copy.textContent = 'Link copiado ✓';
    setTimeout(function () { copy.textContent = label; }, 2000);
  });

  // Contato: validação do formulário
  var form = $('form[data-submit="enviar"]');
  if (form) {
    var GOLD = 'rgb(184,134,43)', LINE = 'rgb(217,215,203)', INK = 'rgb(20,31,27)';
    var nome = form.elements.nome, email = form.elements.email;
    var aceite = $('input[type="checkbox"]', form);
    var aceiteTxt = aceite && aceite.nextElementSibling;
    var ok = $('[data-if="enviado"]', form);
    var btn = $('button[type="submit"]', form);
    var btnLabel = btn && btn.firstChild;
    var tentou = false;
    var erros = function () {
      return { nome: !nome.value.trim(), email: !/^\S+@\S+\.\S+$/.test(email.value), aceite: !aceite.checked };
    };
    var paint = function () {
      var e = erros();
      nome.style.borderColor = tentou && e.nome ? GOLD : LINE;
      email.style.borderColor = tentou && e.email ? GOLD : LINE;
      if (aceiteTxt) aceiteTxt.style.color = tentou && e.aceite ? GOLD : INK;
    };
    form.addEventListener('input', function () {
      if (ok) ok.hidden = true;
      if (btnLabel) btnLabel.nodeValue = 'Enviar mensagem ';
      paint();
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = erros();
      if (e.nome || e.email || e.aceite) { tentou = true; paint(); return; }
      tentou = false;
      form.reset();
      paint();
      if (ok) ok.hidden = false;
      if (btnLabel) btnLabel.nodeValue = 'Mensagem enviada ';
    });
  }
})();
