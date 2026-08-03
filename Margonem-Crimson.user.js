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
// @grant        GM_getResourceURL
// @resource     hebrehoth https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/hebrehoth-smokoludzie.gif
// @resource     archdemon https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/archdemon.gif
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// ==/UserScript==

(() => {
  'use strict';
  const hebrehoth = GM_getResourceURL('hebrehoth');
  const archdemon = GM_getResourceURL('archdemon');

  // Stable base only: no map overlay, no replacement of item/NPC sprites,
  // and no layout changes. The full header is added only after exact DOM mapping.
  GM_addStyle(`
    :root { --crimson:#bf2630; --crimson-hot:#ff5962; --crimson-panel:#130b0c; --crimson-line:#6c2028; --crimson-font:'Trebuchet MS',Arial,sans-serif; --crimson-title:Georgia,'Times New Roman',serif; }
    #crimson-header { position:fixed;top:0;left:0;right:0;height:108px;z-index:2000;pointer-events:none;overflow:hidden;
      background:radial-gradient(ellipse at 50% 0,rgba(111,5,16,.42),transparent 50%),linear-gradient(180deg,#080606 0,#120607 68%,#050505 100%);
      border-bottom:1px solid #701a24;box-shadow:0 3px 14px rgba(0,0,0,.78); }
    #crimson-header::before { content:'';position:absolute;left:10%;right:10%;bottom:3px;height:5px;background:linear-gradient(90deg,transparent,#8d1d28 15%,#e2343e 50%,#8d1d28 85%,transparent);box-shadow:0 0 9px #bd1925; }
    .crimson-header-dragon { position:absolute;top:-42px;width:178px;height:178px;background:url('${hebrehoth}') center/contain no-repeat;filter:drop-shadow(0 0 6px #7f0a14); }
    .crimson-header-dragon.left { left:16px; }.crimson-header-dragon.right { right:16px;transform:scaleX(-1); }
    .crimson-header-emblem { position:absolute;left:50%;bottom:4px;width:43px;height:43px;transform:translateX(-50%);background:url('${archdemon}') center/contain no-repeat;filter:drop-shadow(0 0 6px #c41c28); }
    .interface-layer { top:108px!important;bottom:0!important;height:auto!important; }
    body,button,input,textarea,select,.c-window,.mz-window,.gargonem-window,.vaddonz-window,.popup-menu,.chat-modal,.mAlert {
      font-family:var(--crimson-font)!important;
    }
    .header-label,.header-label .text,.gargonem-window-title,.mz-window__title,.vaddonz-window__header-title,.cards-header,.quest-header {
      font-family:var(--crimson-title)!important;letter-spacing:.15px;
    }
    .c-table,.c-table td,.c-table th,table,table td,table th,.one-item-on-divide-list,.mcl-row,.ll-chat-message-list {
      color:#e4dbd6!important;
    }
    /* UI texture layer — intentional exclusions: .map, .item, .icon and canvas. */
    .top > .bg,
    .bg-additional-widget-left,.bg-additional-widget-right,
    .bottom-left-additional,.bottom-right-additional,
    .bottom-panel-graphic,
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
    /* Keep original button pictograms; recolour only their green interface skin. */
    .widget-button,.ie-icon,.manage-hamburger-button,.attach-icon-show-handheld,
    .mini-map-buttons .button,.window-controlls > *,.transparent-window-buttons-menu > * {
      filter:sepia(1) saturate(2.35) hue-rotate(304deg) brightness(.93) contrast(1.18)!important;
    }
    .widget-button:hover,.ie-icon:hover,.manage-hamburger-button:hover,.attach-icon-show-handheld:hover,
    .mini-map-buttons .button:hover,.window-controlls > *:hover {
      filter:sepia(1) saturate(3.2) hue-rotate(304deg) brightness(1.18) contrast(1.18) drop-shadow(0 0 4px #e62c38)!important;
    }
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
    /* Timer entries keep their own semantic colours and must not inherit the nickname style. */
    .timer .name,.timers .name,.timer-list .name,[class*='timer'] .name,[class*='timer'] .nick {
      color:inherit!important;text-shadow:none!important;
    }
    /* The central HP/turn orb is a round crimson gem, not a stretched panel. */
    .battle-controller [class*='ball'],.battle-controller .time-ball,.time-ball {
      background:radial-gradient(circle at 34% 27%,#ff7476 0,#e6323b 24%,#9b121a 51%,#3b0509 77%,#100305 100%)!important;
      border:2px solid #d53a42!important;border-radius:50%!important;
      box-shadow:0 0 0 2px #340509 inset,0 0 13px rgba(222,28,39,.72)!important;
    }
    /* Bottom battle rail: layered metal, shadow and two claw-like side ornaments. */
    .bottom > .bg,.bottom-panel-of-bottom-positioner {
      background:linear-gradient(180deg,#090607 0,#2f090e 24%,#100607 55%,#050505 100%)!important;
      border-top:1px solid #8e2530!important;
      box-shadow:0 -1px 0 #270509 inset,0 -10px 24px rgba(0,0,0,.55),0 -1px 10px rgba(205,26,37,.5)!important;
    }
    .bottom-panel-of-bottom-positioner { position:relative!important; overflow:visible!important; }
    .bottom-panel-of-bottom-positioner::before,.bottom-panel-of-bottom-positioner::after {
      content:''; position:absolute; top:-15px; width:116px; height:42px; z-index:1; pointer-events:none;
      background:
        linear-gradient(135deg,transparent 0 12%,#100608 13% 20%,#8d2029 21% 23%,#210608 24% 38%,transparent 39% 46%,#8d2029 47% 49%,#160608 50% 67%,transparent 68%),
        linear-gradient(180deg,#160709,#4e1017 48%,#080506);
      border:1px solid #79202a; box-shadow:0 0 0 1px #1b0507 inset,0 0 9px rgba(186,18,29,.5);
      clip-path:polygon(0 63%,17% 25%,43% 0,100% 10%,82% 48%,100% 86%,42% 100%,18% 75%);
    }
    .bottom-panel-of-bottom-positioner::before { left:calc(50% - 174px); }
    .bottom-panel-of-bottom-positioner::after { right:calc(50% - 174px); transform:scaleX(-1); }
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

  const mountHeader = () => {
    if (document.getElementById('crimson-header')) return;
    const header = document.createElement('div');
    header.id = 'crimson-header';
    header.innerHTML = '<i class="crimson-header-dragon left"></i><i class="crimson-header-dragon right"></i><i class="crimson-header-emblem"></i>';
    document.body.appendChild(header);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountHeader, { once:true }); else mountHeader();
})();
