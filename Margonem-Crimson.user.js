// ==UserScript==
// @name         Margonem Crimson
// @namespace    https://github.com/bSlawek-03/Margonem-Crimson
// @version      4.0.0
// @description  Modularny czarno-czerwony motyw interfejsu Margonem.
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
    ['.right-main-column-wrapper', 'equipment-column'],
    ['.inventory-grid-bg', 'inventory-bg'],
    ['.interface-element-item-slot-grid-stretch', 'inventory-grid-frame']
  ];
  let queued = false;
  const markInterface = () => {
    queued = false;
    markerMap.forEach(([selector, name]) => {
      document.querySelectorAll(selector).forEach((element) => { element.dataset.mc = name; });
    });
  };
  const scheduleMarking = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(markInterface);
  };
  new MutationObserver(scheduleMarking).observe(document.documentElement, { childList: true, subtree: true });
  scheduleMarking();

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
    .c-window, .mz-window, .gargonem-window, .vaddonz-window, .popup-menu, .chat-modal, .mAlert {
      background: linear-gradient(145deg, rgba(31, 13, 15, .98), rgba(8, 7, 7, .98)) !important;
      border: 1px solid var(--mc-border) !important;
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

    /* Fixed game frame. These are script-owned markers, not broad game selectors.
       No height, width or position is modified. */
    [data-mc='top-bg'] {
      background-color: #100708 !important;
      background-image:
        repeating-linear-gradient(0deg, rgba(255, 69, 74, .035) 0 1px, transparent 1px 4px),
        linear-gradient(180deg, #1c0709 0%, #080607 82%) !important;
      background-repeat: repeat, no-repeat !important;
      background-position: 0 0, 0 0 !important;
      background-size: auto, auto !important;
      border-bottom: 1px solid #8a1e28 !important;
      box-shadow: inset 0 -2px 0 #210508, 0 2px 8px rgba(175, 17, 28, .28) !important;
    }
    [data-mc='top-left'], [data-mc='top-right'] {
      background: linear-gradient(180deg, rgba(40, 8, 11, .80), rgba(7, 6, 7, .25)) !important;
      border: 1px solid rgba(137, 30, 39, .65) !important;
      border-top: 0 !important;
      box-shadow: 0 4px 10px rgba(0, 0, 0, .55) !important;
    }

    /* Bottom: only paint the native centre layer. No pseudo-elements, no added
       frame and no dimensions — this removes the oversized lower decoration. */
    [data-mc='bottom-bg'] {
      background: repeating-linear-gradient(0deg, rgba(255, 69, 74, .032) 0 1px, transparent 1px 4px),
        linear-gradient(180deg, #080607, #1a0709 55%, #080607) !important;
      border-top: 1px solid #8a1e28 !important;
      box-shadow: inset 0 2px 0 #250609, 0 -2px 8px rgba(175, 17, 28, .26) !important;
    }
    [data-mc='bottom-side'] { background: transparent !important; border: 0 !important; box-shadow: none !important; }
    [data-mc='hp-globe'] { filter: drop-shadow(0 0 5px rgba(197, 21, 31, .35)) !important; }
  `);
})();
