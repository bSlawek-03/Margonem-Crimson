// ==UserScript==
// @name         Margonem Crimson — Hebrehoth
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson-Themes
// @version      2.0.0
// @description  Czarno-czerwony motyw Margonem z grafikami Hebrehotha i Archdemona.
// @author       Sławek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     hebrehoth https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson-Themes/main/assets/hebrehoth-smokoludzie.gif
// @resource     archdemon https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson-Themes/main/assets/archdemon.gif
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson-Themes/main/Margonem-Crimson.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson-Themes/main/Margonem-Crimson.user.js
// ==/UserScript==

(() => {
  'use strict';

  const hebrehoth = GM_getResourceURL('hebrehoth');
  const archdemon = GM_getResourceURL('archdemon');
  const css = `
    :root { --crimson:#c71e29; --crimson-hot:#ff535d; --crimson-dark:#310509; --obsidian:#080707; --panel:#130b0c; --line:#722029; }
    #crimson-header { pointer-events:none; position:fixed; top:0; left:0; width:100%; height:158px; z-index:1; overflow:hidden;
      background:radial-gradient(ellipse at center top,rgba(87,0,10,.40),transparent 55%),linear-gradient(#080606 0%,#120607 68%,transparent); border-bottom:1px solid #4b1219; }
    #crimson-header::after { content:''; position:absolute; left:12%; right:12%; bottom:0; height:10px; background:linear-gradient(90deg,transparent,#8f1b27 18%,#200409 50%,#8f1b27 82%,transparent); box-shadow:0 0 10px #b61220; }
    .crimson-dragon { position:absolute; top:3px; width:192px; height:192px; background:url('${hebrehoth}') center/contain no-repeat; image-rendering:auto; filter:drop-shadow(0 0 8px #6e0811); }
    .crimson-dragon.left { left:16px; }.crimson-dragon.right { right:16px; transform:scaleX(-1); }
    .crimson-title { position:absolute; top:13px; left:50%; transform:translateX(-50%); color:#d62731; font:700 55px/1 Georgia,serif; letter-spacing:3px; text-transform:uppercase; text-shadow:0 2px #210104,0 0 10px #9e0712,0 0 24px #400006; }
    .crimson-emblem { position:absolute; width:56px; height:56px; top:75px; left:50%; transform:translateX(-50%); background:url('${archdemon}') center/contain no-repeat; filter:drop-shadow(0 0 6px #ba1622); }
    .top,.top .bg { background-image:none!important; background-color:transparent!important; }
    .top-left,.top-right { z-index:3!important; }
    .c-window,.mz-window,.gargonem-window,.vaddonz-window,.popup-menu,.chat-modal,.mAlert {
      background:linear-gradient(145deg,rgba(28,12,14,.98),rgba(6,6,6,.98) 72%)!important; border:1px solid var(--line)!important;
      box-shadow:0 0 0 1px #260609 inset,0 0 15px rgba(137,7,18,.35),0 12px 30px rgba(0,0,0,.72)!important; color:#e9ded8!important;
    }
    .header-label-positioner,.gargonem-window-header,.mz-window__header,.vaddonz-window__header,.header-wrapper,.cards-header,.quest-header {
      background:linear-gradient(180deg,#4b0d14,#180508 72%,#080606)!important; border-bottom:1px solid #8e2630!important; color:#ffe2db!important; text-shadow:0 0 5px #cf1825!important;
    }
    .c-window__bottom-bar,.interface-element-bottom-bar-background-stretch,.window-wood-background,.interface-element-vertical-wood,.border-image,.bottom-panel-graphic,.bottom-panel-of-bottom-positioner {
      background-image:none!important; background-color:#0d0809!important; border-color:#681b24!important;
    }
    button,.button,.btn,.m-button,.gargonem-button,.vaddonz-btn,.mz-control,.tab,.mz-tabs__tab,.vaddonz-tabs__item,.toggle-btn {
      color:#f5ded8!important; background:linear-gradient(#58131a,#1c0609 55%,#0a0607)!important; border:1px solid #a42b35!important; box-shadow:0 0 0 1px #240407 inset,0 2px 5px #000,0 0 7px #860b15!important;
    }
    button:hover,.button:hover,.btn:hover,.m-button:hover,.gargonem-button:hover,.vaddonz-btn:hover,.mz-control:hover,.tab:hover { border-color:#ff5962!important; box-shadow:0 0 10px #d81e2c!important; filter:brightness(1.22)!important; }
    input,textarea,select,.ni-input,.gargonem-input,.vaddonz-input__field { background:#0b0808!important; color:#eee!important; border-color:#68202a!important; }
    .eq-slot,.interface-element-equipment,.inventory_wrapper,.inventory-grid-bg,.bags-navigation-bg { background-color:#0d0809!important; border-color:#74212a!important; box-shadow:0 0 0 1px #240609 inset!important; }
    /* Item canvases and sprites are deliberately excluded: only their frames change. */
    .item,.item canvas,.inventory_wrapper canvas,.icon { filter:none!important; }
    .item:hover,.eq-slot:hover { border-color:#ff4b55!important; box-shadow:0 0 9px #db2632!important; }
    .clan,.clan-window,.clan-content,.clan-panel,.clan-ranking-wnd { background-color:#140b0b!important; color:#eadfd8!important; }
    .clan button,.clan .button,.clan .tab { background:linear-gradient(#501118,#180608)!important; border-color:#a52c36!important; color:#ffe4df!important; }
    ::-webkit-scrollbar { width:10px; height:10px; } ::-webkit-scrollbar-track { background:#0b0708; border:1px solid #3c1116; } ::-webkit-scrollbar-thumb { background:linear-gradient(90deg,#390a0d,#9c202a,#390a0d); border:1px solid #b13a42; }
  `;

  const apply = () => {
    GM_addStyle(css);
    const header = document.createElement('div');
    header.id = 'crimson-header';
    header.innerHTML = '<i class="crimson-dragon left"></i><i class="crimson-dragon right"></i><strong class="crimson-title">Margonem</strong><i class="crimson-emblem"></i>';
    document.body.appendChild(header);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once:true }); else apply();
})();
