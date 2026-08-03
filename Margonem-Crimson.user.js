// ==UserScript==
// @name         Margonem Crimson — Hebrehoth
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      2.0.1
// @description  Czarno-czerwony motyw Margonem.
// @author       Sławek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// ==/UserScript==

(() => {
  'use strict';

  // Stable base only: no map overlay, no replacement of item/NPC sprites,
  // and no layout changes. The full header is added only after exact DOM mapping.
  GM_addStyle(`
    :root { --crimson:#bf2630; --crimson-hot:#ff5962; --crimson-panel:#130b0c; --crimson-line:#6c2028; }
    .c-window,.mz-window,.gargonem-window,.vaddonz-window,.popup-menu,.chat-modal,.mAlert {
      background:linear-gradient(145deg,rgba(24,12,14,.97),rgba(7,7,7,.97))!important;
      border-color:var(--crimson-line)!important;
      box-shadow:0 0 0 1px #240609 inset,0 8px 22px rgba(0,0,0,.6)!important;
      color:#ebe1dc!important;
    }
    .header-label-positioner,.gargonem-window-header,.mz-window__header,.vaddonz-window__header {
      background:linear-gradient(180deg,#3d0c12,#150608)!important;
      border-bottom-color:#872630!important;
      color:#ffe2dc!important;
    }
    .c-window__bottom-bar,.interface-element-bottom-bar-background-stretch {
      background-color:#0d0809!important;
      border-color:#5c1820!important;
    }
    button,.button,.btn,.m-button,.gargonem-button,.vaddonz-btn,.mz-control,.tab,.mz-tabs__tab,.vaddonz-tabs__item {
      color:#f3ded8!important;
      background:linear-gradient(#4d1218,#160608)!important;
      border-color:#982a34!important;
    }
    button:hover,.button:hover,.btn:hover,.m-button:hover,.gargonem-button:hover,.vaddonz-btn:hover,.mz-control:hover,.tab:hover {
      border-color:var(--crimson-hot)!important;
      box-shadow:0 0 8px rgba(214,31,43,.65)!important;
    }
    input,textarea,select,.ni-input,.gargonem-input,.vaddonz-input__field {
      background:#0b0808!important;color:#eee!important;border-color:#68202a!important;
    }
  `);
})();
