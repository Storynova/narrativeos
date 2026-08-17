/*
 * NarrativeOS - Asset Library (Phase 1)
 * Self-contained, CSP-safe (no inline code). Loaded via <script src>.
 * Saves generated assets to localStorage and renders a library view.
 * PROPRIETARY / ALL RIGHTS RESERVED - Copyright (c) 2026 StoryNova.
 */
(function () {
  'use strict';
  var KEY = 'narrativeos.assets.v1';

  function all() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function persist(l) { localStorage.setItem(KEY, JSON.stringify(l)); }
  function save(a) {
    var l = all();
    l.unshift({ id: 'a_' + Date.now() + Math.random().toString(36).slice(2, 5),
      type: a.type || 'asset', title: a.title || 'Untitled asset',
      html: a.html || '', createdAt: new Date().toISOString() });
    persist(l); render(); return l[0].id;
  }
  function remove(id) { persist(all().filter(function (a) { return a.id !== id; })); render(); }
  function typeLabel(t) {
    return ({ 'battle-card': 'Battle Card', 'positioning': 'Positioning',
      'product-analysis': 'Product Analysis', 'story-architecture': 'Story Architecture',
      'pitch-deck': 'Pitch Deck', 'creative-hooks': 'Creative Hooks',
      'gtm-launch': 'Launch Plan', 'win-loss': 'Win/Loss' })[t] || 'Asset';
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function render() {
    var root = document.getElementById('asset-library'); if (!root) return;
    var list = all();
    if (!list.length) {
      root.innerHTML = '<div class="al-empty"><h2>Asset Library</h2>' +
        '<p>No saved assets yet. Generate a battle card, positioning, or story and it appears here.</p></div>';
      return;
    }
    root.innerHTML = '<div class="al-head"><h2>Asset Library</h2><span>' + list.length + ' saved</span></div>' +
      '<div class="al-grid">' + list.map(function (a) {
        return '<div class="al-card"><div class="al-tag">' + typeLabel(a.type) + '</div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<div class="al-date">' + new Date(a.createdAt).toLocaleString() + '</div>' +
          '<div class="al-actions"><button data-act="view" data-id="' + a.id + '">View</button>' +
          '<button data-act="delete" data-id="' + a.id + '">Delete</button></div></div>';
      }).join('') + '</div><div id="al-viewer" class="al-viewer"></div>';
    root.querySelectorAll('button[data-act]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        if (b.getAttribute('data-act') === 'delete') { remove(id); return; }
        var a = all().find(function (x) { return x.id === id; });
        var v = document.getElementById('al-viewer');
        if (a && v) { v.innerHTML = '<div class="al-viewer-inner">' + a.html + '</div>'; v.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  /* AUTO-CAPTURE: watch each generator's output panel; when it fills with a
   * result, snapshot it into the library. Works without editing app.js. */
  var PANELS = [
    { sel: '#battlecard-result, #battle-cards .result-panel', type: 'battle-card' },
    { sel: '#positioning-result, #positioning .result-panel', type: 'positioning' },
    { sel: '#product-result, #product-understanding .result-panel', type: 'product-analysis' },
    { sel: '#story-result, #story-architecture .result-panel', type: 'story-architecture' },
    { sel: '#hooks-result, #creative-hooks .result-panel', type: 'creative-hooks' }
  ];
  var lastHash = {};
  function watch() {
    PANELS.forEach(function (p) {
      var el = document.querySelector(p.sel); if (!el) return;
      var html = el.innerHTML.trim();
      if (html.length > 120 && !/Ready for|Ready to|Generating/i.test(el.textContent)) {
        var key = p.type;
        if (lastHash[key] !== html.length) {
          lastHash[key] = html.length;
          var titleEl = el.querySelector('h2,h3,h4');
          save({ type: p.type, title: titleEl ? titleEl.textContent.trim() : typeLabel(p.type), html: html });
        }
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    render();
    setInterval(watch, 1500);
  });

  window.AssetLibrary = { save: save, remove: remove, all: all, render: render };
})();
