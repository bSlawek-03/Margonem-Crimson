// ==UserScript==
// @name         Margonem Crimson - Tla postaci
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      2.0.0
// @description  Automatycznie wybiera wbudowane tlo Margonem (Wlasne 1-6) po nicku postaci.
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

  const characterBackgrounds = {
    twohead: 1,             // Wlasne 1 - Arcymag
    fourhead: 2,            // Wlasne 2 - Renegat
    onehawk: 3,             // Wlasne 3 - Zoons
    threebane: 4,           // Wlasne 4 - Lowczyni
    fivefang: 5,            // Wlasne 5 - Teza
    'po prostu slawek': 6   // Wlasne 6 - Tanrtoth
  };
  const knownCharacters = Object.keys(characterBackgrounds);

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

  let lastKey = '';
  let lastSlot = 0;
  let lastAttempt = 0;

  const visible = (element) => {
    if (!element || !(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' &&
      rect.width > 0 && rect.height > 0;
  };

  const cleanText = (value) => normalize(value).replace(/[·•:]/g, '').trim();

  const findSlot = (slot) => {
    const wanted = cleanText(`wlasne ${slot}`);

    for (const option of document.querySelectorAll('select option')) {
      if (cleanText(option.textContent) !== wanted) continue;
      const select = option.closest('select');
      if (select) return { type: 'select', element: select, option };
    }

    const elements = document.querySelectorAll('button, input, option, [role="option"], [role="button"], div, span, li');
    for (const element of elements) {
      if (!visible(element)) continue;
      if (cleanText(element.textContent || element.value) !== wanted) continue;
      return { type: 'click', element };
    }

    return null;
  };

  const chooseSlot = (slot) => {
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
    const labels = ['brak tla', 'tlo'];
    const elements = document.querySelectorAll('button, input, [role="combobox"], [role="button"], div, span');
    for (const element of elements) {
      if (!visible(element)) continue;
      const text = cleanText(element.textContent || element.value);
      if (!labels.includes(text)) continue;
      element.click();
      return true;
    }
    return false;
  };

  const applyBackground = (slot) => {
    if (!slot || Date.now() - lastAttempt < 500) return;
    lastAttempt = Date.now();

    if (chooseSlot(slot)) {
      lastSlot = slot;
      return;
    }

    // The selector may be a closed custom dropdown. Open it, then try the
    // requested Wlasne N entry on the next DOM turn.
    if (openBackgroundPicker()) {
      window.setTimeout(() => {
        if (chooseSlot(slot)) lastSlot = slot;
      }, 50);
    }
  };

  const tick = () => {
    const key = getCharacterName();

    const slot = key ? characterBackgrounds[key] : 0;
    if (slot && (key !== lastKey || slot !== lastSlot)) {
      applyBackground(slot);
      lastKey = key;
    }
  };

  setInterval(tick, 700);
  tick();
})();
