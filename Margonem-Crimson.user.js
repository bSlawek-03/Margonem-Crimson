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
    /* UI texture layer — intentional exclusions: .map, .item, .icon and canvas. */
    .top,.bottom,.top > .bg,.bottom > .bg,.bottom .content,
    .bg-additional-widget-left,.bg-additional-widget-right,
    .bottom-left-additional,.bottom-right-additional,
    .bottom-panel-of-bottom-positioner,.bottom-panel-graphic,
    .interface-element-bottom-bar-background-stretch,.c-window__bottom-bar,
    .window-wood-background,.interface-element-vertical-wood,
    .interface-element-header-1-background-stretch,.header-background-graphic,
    .bottom-panel-graphics,.middle-graphics,.background-graphic,.graphic-background {
      background-image:
        linear-gradient(90deg,rgba(91,14,22,.85),transparent 9%,transparent 91%,rgba(91,14,22,.85)),
        repeating-linear-gradient(0deg,#16090b 0 4px,#100708 4px 8px)!important;
      background-color:#100708!important;
      border-color:#6b1b25!important;
      box-shadow:0 0 0 1px #230608 inset,0 0 12px rgba(122,9,19,.25)!important;
    }
    .top,.bottom { border-color:#85232d!important; }
    .top::before,.bottom::before {
      content:'';position:absolute;left:4px;right:4px;height:2px;pointer-events:none;
      background:linear-gradient(90deg,transparent,#c42a34 20%,#ff575f 50%,#c42a34 80%,transparent);
      box-shadow:0 0 7px #bb1823;
    }
    .top::before { bottom:1px; }.bottom::before { top:1px; }
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
      background-color:#0d0809!important;border-color:#5c1820!important;
    }
    .border-image,.close-button-corner-decor,.left-decor,.right-decor {
      filter:sepia(1) saturate(2.1) hue-rotate(305deg) brightness(.82) contrast(1.24)!important;
    }
    /* Equipment: rebuild frame/grid only. Item and ability art stays original. */
    .interface-element-equipment,.equipment-wrapper-outline,.equipment-outline-1,
    .equipment-outline-2,.equipment-outline-3,.equipment-outline-4,
    .interface-element-equipment-with-additional-bag,.inventory_wrapper,
    .inventory-grid-bg,.bags-navigation-bg,.interface-element-bag-eq-icon-background,
    .build-icon-wrapper,.build-items-wrapper {
      background-image:linear-gradient(145deg,#26090d,#0a0808 56%,#3a0b11)!important;
      background-color:#0e0809!important;border-color:#7d2530!important;
      box-shadow:0 0 0 1px #26060a inset,0 0 8px rgba(165,14,25,.32)!important;
    }
    .eq-slot {
      background:linear-gradient(145deg,#1d0a0d,#070708)!important;
      border-color:#72222b!important;box-shadow:0 0 0 1px #230609 inset!important;
    }
    .eq-slot:hover { border-color:#ff5962!important;box-shadow:0 0 9px rgba(232,31,43,.75)!important; }
    /* List, chat, timer and clan background tiles; content remains functional. */
    .scroll-pane,.scroll-pane-content,.scroll-wrapper,.content,.inner-content,
    .chat-layer,.chat-overlay,.chat-modal,.ll-chat-message-list,
    .items-list,.group-list,.activity-observe__list,.players-list,
    .clan,.clan-window,.clan-content,.clan-panel,.clan-ranking-wnd,
    .left-column,.right-column-background,.left-grouped-list-right-column,
    .vaddonz-window__body,.gargonem-window-body,.mz-window__content {
      background-color:#0c0909!important;
      background-image:repeating-linear-gradient(135deg,rgba(112,16,25,.10) 0 1px,transparent 1px 7px)!important;
      border-color:#542027!important;
    }
    .one-item-on-divide-list:nth-child(even),.mcl-row:nth-child(even),tr:nth-child(even) { background-color:rgba(116,18,27,.12)!important; }
    .one-item-on-divide-list:hover,.mcl-row:hover,tr:hover { background-color:rgba(184,27,38,.22)!important; }
    .nick,.name,.player-name,.header-label .text,.gargonem-window-title,.mz-window__title { color:#ff7278!important;text-shadow:0 0 5px rgba(219,26,38,.7)!important; }
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
