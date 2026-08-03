// ==UserScript==
// @name         Margonem Crimson — Tło
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      1.6.0
// @description  Tło Margonem z krajobrazem kwitnących wiśni.
// @author       Sławek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     crimsonVoid https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/cherry-blossom-background.png?v=1
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Background.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson-Background.user.js
// ==/UserScript==

(() => {
  'use strict';

  const background = GM_getResourceURL('crimsonVoid');

  GM_addStyle(`
    html,
    body {
      overflow: hidden !important;
      background: #030102 !important;
    }

    /* Only the unused space around Margonem is painted. The game itself
       remains at its native size and stays above this backdrop. */
    body::before {
      content: "" !important;
      position: fixed !important;
      inset: 0 !important;
      z-index: -9999 !important;
      pointer-events: none !important;
      background: #030102 url("${background}") center / cover no-repeat !important;
    }

    #revo-background {
      background-color: #030102 !important;
      background-image: url("${background}") !important;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }

    #centerbox {
      position: relative !important;
      z-index: 10 !important;
    }
  `);

  // Margonem may recreate its black background after the script is loaded.
  // Reapply the wallpaper directly to that layer for every resolution.
  const paintGameBackground = () => {
    const gameBackground = document.getElementById('revo-background');
    if (!gameBackground) return;

    gameBackground.style.setProperty('background-color', '#030102', 'important');
    gameBackground.style.setProperty('background-image', `url("${background}")`, 'important');
    gameBackground.style.setProperty('background-position', 'center', 'important');
    gameBackground.style.setProperty('background-size', 'cover', 'important');
    gameBackground.style.setProperty('background-repeat', 'no-repeat', 'important');
  };

  [0, 200, 800, 2000, 5000].forEach((delay) => setTimeout(paintGameBackground, delay));
})();
