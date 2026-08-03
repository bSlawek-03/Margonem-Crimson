// ==UserScript==
// @name         Margonem Crimson
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      6.3.1
// @description  Modularny czarno-czerwony motyw interfejsu Margonem.
// @author       Sławek
// @match        https://*.margonem.pl/*
// @match        https://margonem.pl/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     crimsonTop https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-top-frame.png
// @resource     crimsonBottom https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-bottom-frame.png
// @resource     crimsonPanel https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-panel-frame.png
// @resource     hpFrame https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/hp-frame-full-exact.png?v=1
// @resource     hpCore https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/hp-core-exact.png?v=2
// @resource     crimsonButton https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/assets/crimson-button-frame.png
// @updateURL    https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// @downloadURL  https://raw.githubusercontent.com/bSlawek-03/Margonem-Crimson/main/Margonem-Crimson.user.js
// ==/UserScript==

(() => {
  'use strict';
  const crimsonTop = GM_getResourceURL('crimsonTop');
  const crimsonBottom = GM_getResourceURL('crimsonBottom');
  const crimsonPanel = GM_getResourceURL('crimsonPanel');
  const hpFrame = GM_getResourceURL('hpFrame');
  const hpCore = GM_getResourceURL('hpCore');
  const crimsonButton = GM_getResourceURL('crimsonButton');

  // Margonem does not expose stable IDs for these elements.  Mark the exact
  // native nodes once they appear, then style the marker rather than broad
  // selectors such as `.bottom .bg`.
  const markerMap = [
    ['.top > .bg', 'top-bg'],
    ['.top-left', 'top-left'],
    ['.top-right', 'top-right'],
    ['.bottom > .bg', 'bottom-bg'],
    ['.bottom > .bg-additional-widget-left', 'bottom-side'],
    ['.bottom > .bg-additional-widget-right', 'bottom-side'],
    ['.hp-indicator-wrapper', 'hp-globe'],
    ['.hud-container', 'hero-hud'],
    ['.right-main-column-wrapper', 'equipment-column'],
    ['.inventory-grid-bg', 'inventory-bg'],
    ['.interface-element-item-slot-grid-stretch', 'inventory-grid-frame']
    ,['.c-window', 'panel-window']
    ,['.mz-window', 'panel-window']
    ,['.gargonem-window', 'panel-window']
    ,['.vaddonz-window', 'panel-window']
    ,['.chat-modal', 'panel-window']
  ];
  let queued = false;
  const markInterface = () => {
    queued = false;
    markerMap.forEach(([selector, name]) => {
      document.querySelectorAll(selector).forEach((element) => { element.dataset.mc = name; });
    });
    const top = document.querySelector('.top');
    if (top && !top.querySelector('#mc-top-frame')) {
      const frame = document.createElement('div');
      frame.id = 'mc-top-frame';
      frame.setAttribute('aria-hidden', 'true');
      top.appendChild(frame);
    }
    document.querySelectorAll("[data-mc='hp-globe']").forEach((wrapper) => {
      const match = wrapper.textContent.match(/(\d{1,3})\s*%/);
      const health = match ? Math.max(0, Math.min(100, Number(match[1]))) : 100;
      const glass = wrapper.querySelector('.glass');
      if (!glass) return;
      let loss = glass.querySelector('.mc-hp-loss');
      if (!loss) {
        loss = document.createElement('div');
        loss.className = 'mc-hp-loss';
        glass.appendChild(loss);
      }
      loss.style.height = `${(100 - health) * 0.66}%`;
      glass.style.setProperty('background', `transparent url("${hpFrame}") center / 100% 100% no-repeat`, 'important');
      glass.style.setProperty('opacity', '1', 'important');
      glass.style.setProperty('filter', 'none', 'important');
      glass.style.setProperty('mask', 'none', 'important');
      glass.style.setProperty('-webkit-mask', 'none', 'important');
      glass.style.setProperty('mix-blend-mode', 'normal', 'important');
      glass.style.setProperty('background-blend-mode', 'normal', 'important');
      glass.style.setProperty('width', '102px', 'important');
      glass.style.setProperty('height', '92px', 'important');
      glass.style.setProperty('transform', 'none', 'important');
      glass.style.setProperty('z-index', '3', 'important');
    });
    document.querySelectorAll("[data-mc='hp-globe'] .hp-indicator").forEach((indicator) => {
      indicator.style.setProperty('background', 'transparent', 'important');
      indicator.style.setProperty('filter', 'none', 'important');
      indicator.style.setProperty('mix-blend-mode', 'normal', 'important');
    });
    document.querySelector('#mc-hp-overlay')?.remove();
  };
  const scheduleMarking = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(markInterface);
  };
  new MutationObserver(scheduleMarking).observe(document.documentElement, { childList: true, subtree: true });
  scheduleMarking();
  setInterval(() => {
    document.querySelectorAll("[data-mc='hp-globe']").forEach((wrapper) => {
      const match = wrapper.textContent.match(/(\d{1,3})\s*%/);
      const loss = wrapper.querySelector('.mc-hp-loss');
      if (match && loss) loss.style.height = `${(100 - Number(match[1])) * 0.66}%`;
    });
  }, 250);
  /*
   * Every group below is bound to a known Margonem UI selector from ui-map.json.
   * Deliberately excluded: map layers, map canvases, .item, .icon and bottom HUD.
   */
  GM_addStyle(`
    :root {
      --mc-red: #b91d29;
      --mc-red-bright: #f34a55;
      --mc-red-dark: #39080d;
      --mc-panel: #110a0b;
      --mc-panel-hi: #211012;
      --mc-border: #66212a;
      --mc-text: #e9dfda;
      --mc-muted: #bdaea8;
      --mc-font: 'Trebuchet MS', Arial, sans-serif;
      --mc-title: Georgia, 'Times New Roman', serif;
    }

    /* Base window chrome: regular game, Gargonem and addon windows. */
    [data-mc='panel-window'], .popup-menu, .mAlert {
      background-color: #100b0b !important;
      background-image: url("${crimsonPanel}") !important;
      background-size: 100% 100% !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      border: 0 !important;
      border-radius: 4px !important;
      box-shadow: 0 0 0 1px #210508 inset, 0 10px 26px rgba(0, 0, 0, .72), 0 0 12px rgba(153, 12, 23, .18) !important;
      color: var(--mc-text) !important;
      font-family: var(--mc-font) !important;
    }
    .header-label-positioner, .gargonem-window-header, .mz-window__header, .vaddonz-window__header {
      background: linear-gradient(180deg, #460d14, #170508 70%, #090606) !important;
      border-bottom: 1px solid #8d2630 !important;
      color: #ffe3dd !important;
      text-shadow: 0 0 5px rgba(219, 28, 39, .7) !important;
      font-family: var(--mc-title) !important;
    }
    .header-label .text, .gargonem-window-title, .mz-window__title, .vaddonz-window__header-title {
      color: #ffe3dd !important;
      font-family: var(--mc-title) !important;
    }
    .close-button, .gargonem-close-button, .close-wrapper {
      position: relative !important;
      overflow: visible !important;
    }
    .close-button::after, .gargonem-close-button::after, .close-wrapper::after {
      content: '\\00d7' !important;
      position: absolute !important;
      inset: 0 !important;
      display: grid !important;
      place-items: center !important;
      color: #ffe4e4 !important;
      font: bold 19px/1 Arial, sans-serif !important;
      text-shadow: 0 1px 2px #000, 0 0 4px #d52d38 !important;
      pointer-events: none !important;
      z-index: 5 !important;
    }
    .c-window__bottom-bar, .interface-element-bottom-bar-background-stretch {
      background: linear-gradient(180deg, #1b080b, #090607) !important;
      border-color: #581720 !important;
    }

    /* Buttons and tabs only — no map or item images. */
    button, input[type='button'], input[type='submit'], .gargonem-button, .vaddonz-btn,
    .mz-control, .mz-state-button, .tab, .mz-tabs__tab, .vaddonz-tabs__item, .toggle-btn,
    .fight-button, .take-reward, .details-btn, .go-to-shop-btn {
      color: #f4ded8 !important;
      background: linear-gradient(180deg, #55131a, #1d070a 58%, #0a0607) !important;
      border: 1px solid #9b2b35 !important;
      box-shadow: 0 0 0 1px #240407 inset, 0 2px 5px #000 !important;
      font-family: var(--mc-font) !important;
    }
    button:hover, input[type='button']:hover, input[type='submit']:hover, .gargonem-button:hover,
    .vaddonz-btn:hover, .mz-control:hover, .mz-state-button:hover, .tab:hover, .mz-tabs__tab:hover,
    .vaddonz-tabs__item:hover, .toggle-btn:hover, .fight-button:hover, .take-reward:hover {
      border-color: var(--mc-red-bright) !important;
      box-shadow: 0 0 9px rgba(229, 34, 45, .72), 0 0 0 1px #3b090d inset !important;
    }
    .tab.active, .tab.selected, .mz-tabs__tab--active, .vaddonz-tabs__item--active {
      background: linear-gradient(180deg, #8a1c25, #36090e) !important;
      border-color: #f2545c !important;
    }

    /* Form controls and actual content panes. */
    .ni-input, .gargonem-input, .vaddonz-input__field, input, textarea, select {
      background: #0b0808 !important;
      color: var(--mc-text) !important;
      border-color: #612029 !important;
      font-family: var(--mc-font) !important;
    }
    .scroll-pane, .scroll-pane-content, .mz-scroll-wrapper, .gargonem-window-body,
    .vaddonz-window__body, .mz-window__content, .cm-editor, .cm-scroller {
      background-color: #0d0909 !important;
      color: var(--mc-text) !important;
      border-color: #4f2026 !important;
    }
    ::-webkit-scrollbar { width: 9px; height: 9px; }
    ::-webkit-scrollbar-track { background: #0a0708; border: 1px solid #3e1116; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #3c0a0e, #9a2029, #3c0a0e); border: 1px solid #b23840; }

    /* Equipment frame and grid: item sprites/canvases are never selected here. */
    .right-main-column-wrapper, .character_wrapper, .interface-element-equipment, .interface-element-equipment-with-additional-bag,
    .equipment-wrapper-outline, .equipment-outline-1, .equipment-outline-2,
    .equipment-outline-3, .equipment-outline-4, .inventory_wrapper, .inventory-grid-bg,
    .bags-navigation-bg, .interface-element-bag-eq-icon-background, .build-icon-wrapper {
      background: linear-gradient(145deg, #240b0d, #090707 60%, #31090d) !important;
      border-color: #7b2630 !important;
      box-shadow: 0 0 0 1px #240609 inset, 0 0 8px rgba(154, 14, 25, .25) !important;
    }
    .eq-slot {
      background: linear-gradient(145deg, #1d0a0d, #070708) !important;
      border-color: #6e222a !important;
      box-shadow: 0 0 0 1px #230609 inset !important;
    }
    .eq-slot:hover { border-color: #f4505a !important; box-shadow: 0 0 9px rgba(232, 31, 43, .7) !important; }
    [data-mc='inventory-bg'], [data-mc='inventory-grid-frame'], .inventory-grid, .inner-grid {
      background-color: #10090a !important;
      background-image: linear-gradient(135deg, rgba(139, 25, 34, .14) 25%, transparent 25%, transparent 50%, rgba(139, 25, 34, .14) 50%, rgba(139, 25, 34, .14) 75%, transparent 75%) !important;
      background-size: 7px 7px !important;
    }
    [data-mc='inventory-grid-frame'] {
      background-color: #0b090a !important;
      background-image:
        linear-gradient(rgba(151, 38, 48, .68) 1px, transparent 1px),
        linear-gradient(90deg, rgba(151, 38, 48, .68) 1px, transparent 1px) !important;
      background-size: 32px 32px !important;
      box-shadow: 0 0 0 1px #7f2430 inset !important;
    }
    .inventory-grid, .inner-grid { background: transparent !important; }
    .inventory_wrapper .scroll-pane,
    .inventory_wrapper .scroll-pane-content,
    .inventory_wrapper .scroll-wrapper {
      background-color: #0a0809 !important;
      background-image:
        linear-gradient(rgba(139, 34, 45, .75) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 34, 45, .75) 1px, transparent 1px) !important;
      background-size: 32px 32px !important;
      background-position: 0 0 !important;
    }
    .interface-element-one-black-tile, .bags-navigation-bg {
      background: linear-gradient(145deg, #21080b, #090708) !important;
      border-color: #74202a !important;
    }

    /* Chat and lists — entries keep game-assigned category colours. */
    .chat-layer .chat-modal, .chat-layer .chat-overlay, .ll-chat-message-list,
    .activity-observe__list, .activity-observe__players, .players-list, .items-list, .group-list {
      background-color: #0d0909 !important;
      border-color: #502026 !important;
      color: var(--mc-text) !important;
    }
    .one-item-on-divide-list:nth-child(even), .mcl-row:nth-child(even), tr:nth-child(even) { background-color: rgba(116, 18, 27, .10) !important; }
    .one-item-on-divide-list:hover, .mcl-row:hover, tr:hover { background-color: rgba(184, 27, 38, .20) !important; }

    /* Clan pages: replace panel/backdrop only, never the clan's banner or posted content. */
    .clan-ranking-wnd, .clan-window, .clan-content, .clan-panel,
    .left-grouped-list-right-column, .right-column-background {
      background-color: #120b0b !important;
      color: var(--mc-text) !important;
      border-color: #5c2027 !important;
    }

    /* Original top/menu icons: preserve glyphs and recolour the green skin only. */
    .widget-button, .ie-icon, .manage-hamburger-button, .attach-icon-show-handheld,
    .mini-map-buttons .button, .window-controlls > *, .transparent-window-buttons-menu > * {
      filter: sepia(1) saturate(1.9) hue-rotate(300deg) brightness(.72) contrast(1.22) !important;
    }
    .widget-button:hover, .ie-icon:hover, .manage-hamburger-button:hover, .attach-icon-show-handheld:hover,
    .mini-map-buttons .button:hover, .window-controlls > *:hover {
      filter: sepia(1) saturate(2.7) hue-rotate(300deg) brightness(.98) contrast(1.2) drop-shadow(0 0 4px #c6232d) !important;
    }
    .top-left .widget-button, .top-right .widget-button, .bottom .widget-button {
      border: 3px solid transparent !important;
      border-image-source: url("${crimsonButton}") !important;
      border-image-slice: 112 !important;
      border-image-width: 3px !important;
      border-image-repeat: stretch !important;
      border-radius: 0 !important;
    }

    /* Fixed game frame. These are script-owned markers, not broad game selectors.
       No height, width or position is modified. */
    [data-mc='top-bg'] {
      background-color: #100708 !important;
      background-image: linear-gradient(180deg, #16080a, #080607) !important;
      border: 0 !important;
      box-shadow: none !important;
    }
    #mc-top-frame {
      position: absolute !important;
      top: 46px !important;
      left: 0 !important;
      width: 100vw !important;
      height: 11px !important;
      pointer-events: none !important;
      z-index: 2 !important;
      background: url("${crimsonTop}") center / 100% 100% no-repeat !important;
      display: none !important;
    }
    [data-mc='top-left'], [data-mc='top-right'] {
      background: linear-gradient(180deg, rgba(40, 8, 11, .80), rgba(7, 6, 7, .25)) !important;
      border: 1px solid rgba(137, 30, 39, .65) !important;
      border-top: 0 !important;
      box-shadow: 0 4px 10px rgba(0, 0, 0, .55) !important;
    }

    /* Bottom: only paint the native centre layer. No pseudo-elements, no added
       frame and no dimensions — this removes the oversized lower decoration. */
    .bottom {
      background-color: #0a0708 !important;
      background-image: url("${crimsonBottom}") !important;
      background-repeat: no-repeat !important;
      background-position: center bottom !important;
      background-size: 100% 100% !important;
      border: 0 !important;
      box-shadow: none !important;
    }
    [data-mc='bottom-bg'] { background: transparent !important; border: 0 !important; box-shadow: none !important; }
    /* HP globe: two independent transparent graphics — frame and HP core. */
    [data-mc='hp-globe'] .hpp {
      position: relative !important;
      z-index: 5 !important;
      color: #ffe7e7 !important;
      font-family: Georgia, serif !important;
      font-weight: bold !important;
      text-shadow: 0 1px 2px #000, 0 0 5px #8f1019 !important;
    }
    [data-mc='hp-globe'] .blood-frame {
      opacity: 0 !important;
    }
    [data-mc='hp-globe'] .hp-indicator {
      z-index: 4 !important;
      background: transparent !important;
      filter: none !important;
      mix-blend-mode: normal !important;
    }
    [data-mc='hp-globe'] .blood {
      position: relative !important;
      z-index: 2 !important;
      background-image: url("${hpCore}") !important;
      background-repeat: no-repeat !important;
      background-position: center bottom !important;
      background-size: 100% auto !important;
      box-shadow: none !important;
      opacity: 0 !important;
    }
    [data-mc='hp-globe'] .glass {
      position: relative !important;
      z-index: 3 !important;
      opacity: 1 !important;
      pointer-events: none !important;
      mix-blend-mode: normal !important;
      background-blend-mode: normal !important;
      width: 102px !important;
      height: 92px !important;
      transform: none !important;
      background: transparent url("${hpFrame}") center / 100% 100% no-repeat !important;
    }
    [data-mc='hp-globe'] .mc-hp-loss {
      position: absolute;
      z-index: 1;
      top: 17%;
      left: 21.5%;
      width: 57%;
      max-height: 66%;
      background: #080506;
      border-radius: 48% 48% 22% 22%;
      box-shadow: inset 0 -2px 4px rgba(145, 8, 16, .4);
      pointer-events: none;
    }
  `);
})();
