// ==UserScript==
// @name         Margonem Crimson — Tło
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      1.4.0
// @description  Czarne tło Crimson z arcydemonem po prawej stronie.
// @author       Sławek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     crimsonVoid https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-archdemon-background.png?v=2
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
      background: #030102 url("${background}") 80px center / 100vw 100vh no-repeat !important;
    }

    #revo-background {
      background: transparent !important;
    }

    #centerbox {
      position: relative !important;
      z-index: 10 !important;
    }
  `);
})();
