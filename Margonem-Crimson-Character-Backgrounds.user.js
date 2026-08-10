// ==UserScript==
// @name         Margonem Crimson - Tła postaci
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      4.7.0
// @description  Panel do przypisywania RAW tła do postaci Margonem.
// @author       Slawek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Character-Backgrounds.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Character-Backgrounds.user.js
// ==/UserScript==

(() => {
  'use strict';

  const STORAGE_KEY = 'margonem-crimson-character-backgrounds-v9';

  const characters = [
    { key: 'fourhead', label: 'Fourhead', level: '114', slot: 1 },
    { key: 'twohead', label: 'Twohead', level: '144', slot: 2 },
    { key: 'onehawk', label: 'Onehawk', level: '167', slot: 3 },
    { key: 'threebane', label: 'Threebane', level: '190', slot: 4 },
    { key: 'fivefang', label: 'Fivefang', level: '264', slot: 5 },
    { key: 'po prostu slawek', label: 'Po Prostu Sławek', level: '300', slot: 6 }
  ];

  const knownCharacters = characters.map((item) => item.key);

  const defaultUrls = {
    fourhead: 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-renegat-baulus-background.png?v=7',
    twohead: 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-archdemon-background.png?v=7',
    onehawk: 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-versus-zoons-background.png?v=7',
    threebane: 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-lowcz-driady-background.png?v=7',
    fivefang: 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-tezcatlipoca-background.png?v=7',
    'po prostu slawek': 'https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/titan-ice-king-background.png?v=7'
  };

  const defaults = Object.fromEntries(characters.map((item) => [item.key, {
    slot: item.slot,
    url: defaultUrls[item.key] || ''
  }]));

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const cleanText = (value) => normalize(value).replace(/[·•:]/g, '').trim();
  const addonRoot = () => document.querySelector('#addon_29');
  const slotValue = (slot) => String(99 + Number(slot));

  const loadConfig = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Object.fromEntries(characters.map((item) => [item.key, {
        slot: Number(saved[item.key]?.slot) || item.slot,
        url: typeof saved[item.key]?.url === 'string' && saved[item.key].url.trim()
          ? saved[item.key].url.trim()
          : defaults[item.key].url
      }]));
    } catch (_) {
      return structuredClone(defaults);
    }
  };

  let config = loadConfig();

  const saveConfig = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (_) {
      // Storage can be blocked by a private browsing policy; runtime still works.
    }
  };

  const visible = (element) => {
    if (!element || !(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' &&
      rect.width > 0 && rect.height > 0;
  };

  const getCharacterName = () => {
    const viewportCenter = window.innerWidth / 2;
    const candidates = document.querySelectorAll('body div, body span, body b, body strong');
    let best = null;

    for (const element of candidates) {
      if (element.closest('#mc-character-panel, #mc-character-toggle')) continue;
      const text = normalize(element.textContent);
      if (text.length > 80) continue;

      const characterKey = knownCharacters.find((name) =>
        text === name || text.startsWith(`${name} `)
      );
      if (!characterKey) continue;

      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.top < -10 || rect.top > window.innerHeight * 0.25) continue;

      const distance = Math.abs((rect.left + rect.width / 2) - viewportCenter);
      if (distance > window.innerWidth * 0.35) continue;

      const score = distance + rect.top * 2 + text.length;
      if (!best || score < best.score) best = { key: characterKey, score };
    }

    return best ? best.key : '';
  };

  const findSlot = (slot) => {
    const wanted = cleanText(`własne ${slot}`);

    for (const option of document.querySelectorAll('select option')) {
      if (cleanText(option.textContent) !== wanted) continue;
      const select = option.closest('select');
      if (select) return { type: 'select', element: select, option };
    }

    const elements = document.querySelectorAll('button, input, [role="option"], [role="button"], div, span, li');
    for (const element of elements) {
      if (!visible(element)) continue;
      if (cleanText(element.textContent || element.value) !== wanted) continue;
      return { type: 'click', element };
    }

    return null;
  };

  const chooseSlot = (slot) => {
    const root = addonRoot();
    const backgroundMenu = root?.querySelector('.background-menu-wrapper');
    if (backgroundMenu) {
      const wantedValue = slotValue(slot);
      const current = backgroundMenu.querySelector('.bck .menu-option');
      if (current?.getAttribute('value') === wantedValue) return true;

      const option = Array.from(document.querySelectorAll('.scroll-wrapper.menu-wrapper .bck-wrapper .option'))
        .find((item) => item.getAttribute('value') === wantedValue && visible(item));
      if (option) {
        option.click();
        return true;
      }

      // Open the list only when it is not already open. The next tick will
      // click the option after Margonem has rendered the menu.
      const opener = backgroundMenu.querySelector('.bck.button');
      if (opener) {
        opener.click();
        lastMenuOpen = Date.now();
      }
    }

    const found = findSlot(slot);
    if (!found) return false;

    if (found.type === 'select') {
      const index = Array.from(found.element.options).indexOf(found.option);
      if (index < 0) return false;
      found.element.selectedIndex = index;
      found.element.dispatchEvent(new Event('input', { bubbles: true }));
      found.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    found.element.click();
    return true;
  };

  const openBackgroundPicker = () => {
    const backgroundMenu = addonRoot()?.querySelector('.background-menu-wrapper');
    if (Date.now() - lastMenuOpen < 250) return true;
    const visibleOption = Array.from(document.querySelectorAll('.scroll-wrapper.menu-wrapper .bck-wrapper .option'))
      .some((item) => visible(item));
    if (visibleOption) return true;

    const addonOpener = backgroundMenu?.querySelector('.bck.button');
    if (addonOpener) {
      addonOpener.click();
      return true;
    }

    const labels = ['brak tła', 'tło'];
    const elements = document.querySelectorAll('button, input, [role="combobox"], [role="button"], div, span');
    for (const element of elements) {
      if (!visible(element)) continue;
      const text = cleanText(element.textContent || element.value);
      if (!labels.includes(text) && !/^wlasne \d+$/.test(text)) continue;
      element.click();
      return true;
    }
    return false;
  };

  const fitGameBackground = () => {
    const gameBackground = document.getElementById('revo-background');
    if (!gameBackground) return;
    // Margonem keeps the selected image; these properties only stop it being
    // cropped and keep the titan on the right side of the game area.
    gameBackground.style.setProperty('background-position', 'center right', 'important');
    gameBackground.style.setProperty('background-size', 'contain', 'important');
    gameBackground.style.setProperty('background-repeat', 'no-repeat', 'important');
  };

  let rawStyleSnapshot = null;
  let observedBackground = null;
  let backgroundObserver = null;

  const applyRawBackground = (url) => {
    const gameBackground = document.getElementById('revo-background');
    if (!gameBackground || !url) return false;

    if (!rawStyleSnapshot) {
      rawStyleSnapshot = {};
      for (const property of ['background-image', 'background-position', 'background-size', 'background-repeat']) {
        rawStyleSnapshot[property] = gameBackground.style.getPropertyValue(property);
      }
    }

    const currentImage = gameBackground.style.getPropertyValue('background-image');
    if (gameBackground.dataset.mcrimsonRawUrl === url && currentImage.includes(url)) return true;

    gameBackground.dataset.mcrimsonRaw = '1';
    gameBackground.dataset.mcrimsonRawUrl = url;
    gameBackground.style.setProperty('background-image', `url("${url.replace(/"/g, '%22')}")`, 'important');
    gameBackground.style.setProperty('background-position', 'center right', 'important');
    gameBackground.style.setProperty('background-size', 'contain', 'important');
    gameBackground.style.setProperty('background-repeat', 'no-repeat', 'important');
    return true;
  };

  const watchGameBackground = () => {
    const gameBackground = document.getElementById('revo-background');
    if (!gameBackground || gameBackground === observedBackground) return;

    backgroundObserver?.disconnect();
    observedBackground = gameBackground;
    backgroundObserver = new MutationObserver(() => {
      const key = getCharacterName();
      const url = key ? config[key]?.url : '';
      if (url) applyRawBackground(url);
    });
    backgroundObserver.observe(gameBackground, { attributes: true, attributeFilter: ['style', 'class'] });
  };

  const clearRawBackground = () => {
    const gameBackground = document.getElementById('revo-background');
    if (!gameBackground || !rawStyleSnapshot) return;

    for (const [property, value] of Object.entries(rawStyleSnapshot)) {
      if (value) gameBackground.style.setProperty(property, value);
      else gameBackground.style.removeProperty(property);
    }
    delete gameBackground.dataset.mcrimsonRaw;
    rawStyleSnapshot = null;
  };

  let lastCharacter = '';
  let lastAppliedSlot = 0;
  let lastAttempt = 0;
  let lastMenuOpen = 0;

  const readSelectedSlot = () => {
    const current = addonRoot()?.querySelector('.background-menu-wrapper .bck .menu-option');
    const addonValue = Number(current?.getAttribute('value'));
    if (addonValue >= 100 && addonValue <= 105) return addonValue - 99;

    for (const select of document.querySelectorAll('select')) {
      if (!visible(select) || select.closest('#mc-character-panel')) continue;
      const text = cleanText(select.options[select.selectedIndex]?.textContent);
      const match = text.match(/^wlasne (\d+)$/);
      if (match) return Number(match[1]);
    }

    const elements = document.querySelectorAll('input, button, [role="combobox"], [role="button"], div, span');
    for (const element of elements) {
      if (!visible(element) || element.closest('#mc-character-panel, #mc-character-toggle')) continue;
      const text = cleanText(element.textContent || element.value);
      const match = text.match(/^wlasne (\d+)$/);
      if (match) return Number(match[1]);
    }
    return 0;
  };

  const applyForCharacter = (key) => {
    const entry = config[key];
    if (!entry) return;

    const now = Date.now();
    if (now - lastAttempt < 500 && key === lastCharacter) return;
    lastAttempt = now;

    watchGameBackground();

    if (readSelectedSlot() === entry.slot) {
      clearRawBackground();
      fitGameBackground();
      lastAppliedSlot = entry.slot;
      lastCharacter = key;
      return;
    }

    // Prefer the real Margonem background option. The RAW image is only a
    // fallback when the requested custom slot has not been created there.
    if (entry.url && applyRawBackground(entry.url)) {
      fitGameBackground();
      lastAppliedSlot = entry.slot;
      lastCharacter = key;
      setPanelStatus(`Aktywne tło postaci: ${characters.find((item) => item.key === key)?.label || key}`);
      return;
    }

    if (chooseSlot(entry.slot)) {
      clearRawBackground();
      fitGameBackground();
      lastAppliedSlot = entry.slot;
      lastCharacter = key;
      setPanelStatus(`Wybrano w Margonem: Własne ${entry.slot}`);
      return;
    }

    if (openBackgroundPicker()) {
      window.setTimeout(() => {
        if (chooseSlot(entry.slot)) {
          clearRawBackground();
          fitGameBackground();
          lastAppliedSlot = entry.slot;
          lastCharacter = key;
          setPanelStatus(`Wybrano w Margonem: Własne ${entry.slot}`);
        } else if (entry.url && applyRawBackground(entry.url)) {
          lastAppliedSlot = 0;
          lastCharacter = key;
          setPanelStatus(`Slot Własne ${entry.slot} nie istnieje — użyto RAW`);
        }
      }, 80);
      return;
    }

    if (entry.url && applyRawBackground(entry.url)) {
      lastAppliedSlot = 0;
      lastCharacter = key;
      setPanelStatus(`Slot Własne ${entry.slot} nie istnieje — użyto RAW`);
    }
  };

  let panelStatus = null;
  let characterSelect = null;
  let slotSelect = null;
  let urlInput = null;
  let panel = null;

  const setPanelStatus = (message) => {
    if (panelStatus) panelStatus.textContent = message;
  };

  const updateEditor = () => {
    if (!characterSelect || !slotSelect || !urlInput) return;
    const key = characterSelect.value;
    slotSelect.value = String(config[key]?.slot || 1);
    urlInput.value = config[key]?.url || '';
  };

  const renderAssignments = () => {
    const list = panel?.querySelector('[data-mc-list]');
    if (!list) return;
    list.textContent = '';

    for (const item of characters) {
      const row = document.createElement('div');
      row.className = 'mc-row';
      row.innerHTML = `<span>${item.label} <small>(${item.level})</small></span><b>Własne ${config[item.key]?.slot || item.slot}</b>`;
      row.addEventListener('click', () => {
        characterSelect.value = item.key;
        updateEditor();
      });
      list.appendChild(row);
    }
  };

  const buildPanel = () => {
    if (document.getElementById('mc-character-toggle')) return;

    const style = document.createElement('style');
    style.id = 'mc-character-background-style';
    style.textContent = `
      #mc-character-toggle{position:fixed;right:18px;top:18px;z-index:2147483646;border:1px solid #a52b35;border-radius:6px;background:linear-gradient(#4a1118,#170508);color:#ffd5d5;padding:7px 10px;font:700 12px Arial;cursor:pointer;box-shadow:0 0 10px #000}
      #mc-character-panel{position:fixed;right:18px;top:55px;width:330px;z-index:2147483647;padding:12px;border:1px solid #9b2633;border-radius:8px;background:linear-gradient(145deg,#1d090c,#080606 65%);color:#f6e9e9;font:13px Arial;box-shadow:0 10px 35px #000;display:none}
      #mc-character-panel.open{display:block}
      #mc-character-panel h3{margin:0 0 8px;color:#ff6972;font-size:15px}
      #mc-character-panel label{display:block;margin:7px 0 4px;color:#e9b5b5}
      #mc-character-panel select,#mc-character-panel input{box-sizing:border-box;width:100%;border:1px solid #74303a;border-radius:4px;background:#0c0808;color:#fff;padding:7px}
      #mc-character-panel button{border:1px solid #9b303b;border-radius:4px;background:#351016;color:#fff;padding:7px 9px;margin-top:8px;cursor:pointer}
      #mc-character-panel button:hover{background:#671b24}
      #mc-character-panel .mc-status{min-height:18px;margin-top:8px;color:#ffb2b2;font-size:11px}
      #mc-character-panel .mc-list{margin-top:10px;border-top:1px solid #462027;padding-top:5px}
      #mc-character-panel .mc-row{display:flex;justify-content:space-between;padding:5px 3px;cursor:pointer;border-bottom:1px solid #251015}
      #mc-character-panel .mc-row:hover{background:#3b1219}
      #mc-character-panel small{color:#b98d8d}
      #mc-character-panel .mc-help{color:#b99a9a;font-size:11px;line-height:1.35;margin-top:8px}
    `;
    document.head.appendChild(style);

    const toggle = document.createElement('button');
    toggle.id = 'mc-character-toggle';
    toggle.textContent = 'Crimson tła';
    toggle.addEventListener('click', () => panel.classList.toggle('open'));
    document.body.appendChild(toggle);

    panel = document.createElement('section');
    panel.id = 'mc-character-panel';
    panel.innerHTML = `
      <h3>Tła przypisane do postaci</h3>
      <label>Postać</label>
      <select data-mc-character></select>
      <label>Slot referencyjny dodatku Margonem</label>
      <select data-mc-slot>${Array.from({length: 6}, (_, index) => `<option value="${index + 1}">Własne ${index + 1}</option>`).join('')}</select>
      <label>RAW obrazu (opcjonalnie)</label>
      <input data-mc-url type="url" placeholder="https://raw.githubusercontent.com/...png">
      <button data-mc-save>Zapisz przypisanie</button>
      <button data-mc-test>Testuj teraz</button>
      <div class="mc-status" data-mc-status></div>
      <div class="mc-list" data-mc-list></div>
      <div class="mc-help">Dodatek Margonem ma jedno globalne pole Tło. Ten panel przypisuje RAW niezależnie do każdej postaci i ponawia ustawienie po każdym nadpisaniu.</div>
    `;
    document.body.appendChild(panel);

    characterSelect = panel.querySelector('[data-mc-character]');
    slotSelect = panel.querySelector('[data-mc-slot]');
    urlInput = panel.querySelector('[data-mc-url]');
    panelStatus = panel.querySelector('[data-mc-status]');

    for (const item of characters) {
      const option = document.createElement('option');
      option.value = item.key;
      option.textContent = `${item.label} (${item.level})`;
      characterSelect.appendChild(option);
    }

    characterSelect.addEventListener('change', updateEditor);
    panel.querySelector('[data-mc-save]').addEventListener('click', () => {
      const key = characterSelect.value;
      const url = urlInput.value.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        setPanelStatus('RAW musi zaczynać się od http:// albo https://');
        return;
      }
      config[key] = { slot: Number(slotSelect.value) || 1, url };
      saveConfig();
      renderAssignments();
      setPanelStatus(`Zapisano: ${characterSelect.options[characterSelect.selectedIndex].text} → Własne ${config[key].slot}`);
      if (getCharacterName() === key) applyForCharacter(key);
    });
    panel.querySelector('[data-mc-test]').addEventListener('click', () => applyForCharacter(characterSelect.value));

    characterSelect.value = characters[0].key;
    updateEditor();
    renderAssignments();
  };

  const tick = () => {
    watchGameBackground();
    const key = getCharacterName();
    if (!key) return;
    const wantedSlot = config[key]?.slot || 0;
    const selectedSlot = readSelectedSlot();
    // Margonem can restore its own value after a character/map refresh.
    // Keep enforcing the character assignment when that happens.
    if (key !== lastCharacter || wantedSlot !== lastAppliedSlot || selectedSlot !== wantedSlot) {
      applyForCharacter(key);
    }
  };

  const start = () => {
    if (!document.body) return window.setTimeout(start, 50);
    buildPanel();
    tick();
    window.setInterval(tick, 700);
  };

  start();
})();
