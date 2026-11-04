(function () {
  'use strict';

  if (window.__riseFallback) clearTimeout(window.__riseFallback);

  // ---------- Progreso de lectura ----------
  var myths = Array.prototype.slice.call(document.querySelectorAll('.myth'));
  var label = document.getElementById('explored');
  var fill = document.getElementById('meter-fill');
  var toggleAll = document.getElementById('toggle-all');
  var explored = {};   // solo en memoria: se reinicia al recargar

  function update() {
    var n = Object.keys(explored).length;
    label.textContent = 'Has explorado ' + n + ' de ' + myths.length;
    fill.style.transform = 'scaleX(' + (n / myths.length) + ')';
    var allOpen = myths.every(function (d) { return d.open; });
    toggleAll.textContent = allOpen ? 'Cerrar todas' : 'Abrir todas';
  }

  myths.forEach(function (d, i) {
    d.addEventListener('toggle', function () {
      if (d.open) explored[i] = true;
      update();
    });
  });

  toggleAll.hidden = false;
  toggleAll.addEventListener('click', function () {
    var open = !myths.every(function (d) { return d.open; });
    myths.forEach(function (d) { d.open = open; });
  });

  update();

  // ---------- Entradas al hacer scroll ----------
  var items = document.querySelectorAll('[data-rise]');
  if (!('IntersectionObserver' in window)) {
    document.documentElement.classList.add('no-rise');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    var batch = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      // Escalonar los elementos que entran juntos (filas de mitos)
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', batch++);
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
  items.forEach(function (el) { io.observe(el); });
})();
