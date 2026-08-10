// ==UserScript==
// @name         Margonem Crimson - Tla postaci
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      1.0.1
// @description  Automatycznie zmienia tlo po nicku aktualnej postaci.
// @author       Slawek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     arcymag https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-archdemon-background.png?v=1
// @resource     renegat https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-renegat-baulus-background.png?v=1
// @resource     zoons https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-versus-zoons-background.png?v=1
// @resource     lowczyni https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-lowcz-driady-background.png?v=1
// @resource     teza https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-tezcatlipoca-background.png?v=1
// @resource     tanrtoth https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-ice-king-background.png?v=1
// @resource     domyslne https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/cherry-blossom-background.png?v=1
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Character-Backgrounds.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Character-Backgrounds.user.js
// ==/UserScript==

(() => {
  'use strict';

  const backgrounds = {
    arcymag: GM_getResourceURL('arcymag'),
    renegat: GM_getResourceURL('renegat'),
    zoons: GM_getResourceURL('zoons'),
    lowczyni: GM_getResourceURL('lowczyni'),
    teza: GM_getResourceURL('teza'),
    tanrtoth: GM_getResourceURL('tanrtoth'),
    domyslne: GM_getResourceURL('domyslne')
  };

  const characterBackgrounds = {
    twohead: 'arcymag',
    fourhead: 'renegat',
    onehawk: 'zoons',
    threebane: 'lowczyni',
    fivefang: 'teza',
    'po prostu slawek': 'tanrtoth'
  };

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const getCharacterName = () => {
    const viewportCenter = window.innerWidth / 2;
    const candidates = document.querySelectorAll('body div, body span, body b, body strong');
    let best = null;

    for (const element of candidates) {
      const text = element.textContent.replace(/\s+/g, ' ').trim();
      const match = text.match(/^(.+?)\s*\(\s*\d+\s*[a-z]?\s*\)/i);
      if (!match || match[1].length > 40) continue;

      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.top < -10 || rect.top > window.innerHeight * 0.25) continue;

      const distance = Math.abs((rect.left + rect.width / 2) - viewportCenter);
      if (distance > window.innerWidth * 0.35) continue;

      const score = distance + rect.top * 2 + text.length;
      if (!best || score < best.score) best = { name: match[1].trim(), score };
    }

    return best ? best.name : '';
  };

  GM_addStyle(`
    html,
    body {
      overflow: hidden !important;
      background: #030102 !important;
    }

    body::before {
      content: "" !important;
      position: fixed !important;
      inset: 0 !important;
      z-index: -9999 !important;
      pointer-events: none !important;
      background: #030102 center / cover no-repeat !important;
      background-image: var(--crimson-character-background) !important;
    }

    #revo-background {
      background-color: #030102 !important;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }

    #centerbox {
      position: relative !important;
      z-index: 10 !important;
    }
  `);

  let lastKey = '';
  let lastPaint = 0;

  const applyBackground = (key) => {
    const image = backgrounds[key] || backgrounds.domyslne;
    if (!image) return;

    const cssImage = `url("${image}")`;
    document.documentElement.style.setProperty('--crimson-character-background', cssImage);

    for (const element of [document.documentElement, document.body, document.getElementById('revo-background')]) {
      if (!element) continue;
      element.style.setProperty('background-color', '#030102', 'important');
      element.style.setProperty('background-image', cssImage, 'important');
      element.style.setProperty('background-position', 'center', 'important');
      element.style.setProperty('background-size', 'cover', 'important');
      element.style.setProperty('background-repeat', 'no-repeat', 'important');
    }

    lastPaint = Date.now();
  };

  const tick = () => {
    const name = getCharacterName();
    const key = characterBackgrounds[normalize(name)] || 'domyslne';

    if (key !== lastKey || Date.now() - lastPaint > 2500) {
      applyBackground(key);
      lastKey = key;
    }
  };

  applyBackground('domyslne');
  setInterval(tick, 700);
  tick();
})();
