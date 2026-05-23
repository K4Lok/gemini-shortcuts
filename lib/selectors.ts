/**
 * DOM Selectors for Gemini interface elements
 * Using stable selectors based on aria-labels, data-test-ids, and semantic attributes
 */

export const SELECTORS = {
  // New Chat button - using data-test-id and aria-label patterns
  newChatButton: [
    '[data-test-id="new-chat-button"]',
    'a[aria-label*="New chat" i]',
    'button[aria-label*="New chat" i]',
    // Sidebar new chat button
    '.new-chat-button',
    '[class*="new-chat"]',
  ],

  // Main menu / Sidebar toggle (hamburger / sparkle)
  // Signed-in: "Close sidebar" button appears when open, "Open sidebar" when collapsed
  // (only one is visible at a time — order matters so we pick whichever is rendered).
  sidebarToggle: [
    // Open state - "Close sidebar" button is visible
    'button[aria-label*="Close sidebar" i]',
    // Collapsed state - "Open sidebar" button visible (also has side-nav-sparkle-button test-id)
    'button[aria-label*="Open sidebar" i]',
    // Legacy hamburger (unauth landing)
    'button[data-test-id="side-nav-menu-button"]',
    'button[aria-label*="Main menu" i]',
    'button[aria-label*="Toggle" i][aria-label*="sidebar" i]',
    'button[aria-label*="Navigation" i]',
  ],

  // Search input for chats - the search is triggered by a button first
  searchButton: [
    'button[aria-label*="Search" i]',
    '[data-test-id*="search" i]',
    'button[mattooltip*="Search" i]',
  ],

  searchInput: [
    'input[placeholder*="Search" i]',
    'input[aria-label*="Search" i]',
    '[role="search"] input',
    'input[type="search"]',
    // Search combobox
    'input[role="combobox"]',
  ],

  // Main prompt textarea / input area
  promptInput: [
    // Rich text editor
    '.ql-editor[contenteditable="true"]',
    'div[contenteditable="true"][aria-label*="prompt" i]',
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="plaintext-only"]',
    '[data-placeholder*="Enter" i][contenteditable="true"]',
    // Fallback
    'rich-textarea [contenteditable="true"]',
    '.input-area [contenteditable="true"]',
  ],

  // Copy button for responses - target the inner <button>, not the <gem-icon-button> wrapper
  copyButton: [
    '[data-test-id="copy-button"] button',
    'copy-button button',
    'button[aria-label="Copy"]',
    'button[mattooltip="Copy response"]',
    'button:has(mat-icon[fonticon="content_copy"])',
  ],

  // Stop generation button (aria-label is "Stop response" in the current UI)
  stopButton: [
    'button[aria-label*="Stop" i]',
    'button[aria-label*="Cancel" i]',
    'button[mattooltip*="Stop" i]',
  ],

  // Response containers (for copying last response)
  responseContainer: [
    // New custom element wrapping each model response
    'model-response',
    // Class moved from <message-content> to <structured-content-container> — match by class
    '.model-response-text',
    '.markdown-main-panel',
    '[data-message-author-role="assistant"]',
    '.response-container-content',
  ],

  // Model switcher button (opens the mode selection menu)
  // Works on both desktop dropdown and mobile bottom sheet
  modelSwitcher: [
    '[data-test-id="bard-mode-menu-button"]',
    '.pill-ui-logo-container[aria-haspopup="menu"]',
    'bard-mode-switcher [aria-haspopup="menu"]',
    '.model-picker-container [role="button"]',
    'button.input-area-switch',
    // Mobile mode switcher in bottom sheet trigger
    'bard-mode-switcher button',
  ],

  // Model options in the menu (after menu is opened)
  // New UI uses <gem-menu-item role="menuitem"> with hashed test-ids; legacy used <button>.
  modelOptions: [
    // Current desktop menu options (any tag, hashed test-id)
    '[data-test-id^="bard-mode-option"]',
    // Legacy fallbacks
    '.bard-mode-list-button',
    '.gds-mode-switch-menu [role="menuitemradio"]',
    '.mat-mdc-menu-panel [role="menuitemradio"]',
    // Mobile bottom sheet options
    '[data-test-id="mobile-nested-mode-menu"] [data-test-id^="bard-mode-option"]',
    '.bard-mode-bottom-sheet .bard-mode-list-button',
    'mat-bottom-sheet-container .bard-mode-list-button',
    '.mat-bottom-sheet-container [role="menuitem"]',
  ],

  // Theme menu button (inside settings menu)
  themeMenuButton: [
    // Desktop - Theme button with data-test-id (primary)
    '[data-test-id="desktop-theme-menu-button"]',
    'button[data-test-id="desktop-theme-menu-button"]',
    // Fallback - button with routine icon
    'button[mat-menu-item]:has(mat-icon[fonticon="routine"])',
    '.mat-mdc-menu-item:has(mat-icon[fonticon="routine"])',
    // Mobile - theme button in settings list
    '[data-test-id="theme-menu-item"]',
  ],

  // Theme options in submenu/bottom sheet
  themeOptions: [
    // Desktop submenu - mat-menu-item buttons (primary)
    '.mat-mdc-menu-panel button.mat-mdc-menu-item',
    '.mat-mdc-menu-panel .mat-mdc-menu-item',
    // Mobile bottom sheet theme options (with specific data-test-ids)
    '[data-test-id="mobile-theme-system"]',
    '[data-test-id="mobile-theme-light"]',
    '[data-test-id="mobile-theme-dark"]',
  ],

  // Settings/More menu button (to access theme)
  // Signed-in: new "mavatar-footer-settings-button" (real <button>, in avatar footer).
  // Unauth landing: legacy "settings-and-help-button" (a <side-nav-action-button>
  // wrapper — must target the inner <button>).
  settingsMenuButton: [
    // Signed-in (current UI)
    'button[data-test-id="mavatar-footer-settings-button"]',
    // Legacy unauth landing — target inner <button> not the wrapper
    '[data-test-id="settings-and-help-button"] button',
    // Mobile settings button
    '[data-test-id="mobile-settings-and-help-control"]',
    // Fallback selectors
    '[aria-label*="Settings" i][aria-label*="help" i]',
    'button[aria-label*="Settings" i]',
    'button[aria-label*="Setting" i]',
    '[data-test-id="settings-button"]',
  ],

  // Temporary chat button - target inner <button>, not the <gem-icon-button> wrapper
  tempChatButton: [
    '[data-test-id="temp-chat-button"] button',
    'button[aria-label*="Temporary chat" i]',
    'button.temp-chat-button',
  ],

  // Overlay backdrop (to close modals/menus) — dark backdrop variant was removed
  overlayBackdrop: [
    '.cdk-overlay-backdrop',
    '.cdk-overlay-dark-backdrop',
  ],
} as const;

/**
 * Check if an element is rendered (has non-zero size). Gemini often keeps both
 * "open" and "close" sidebar buttons in the DOM but only renders one at a time.
 */
function isVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return true;
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

/**
 * Query for an element using multiple selector strategies.
 * Prefers a visible match across all selectors; falls back to first match if none are visible.
 */
export function queryElement(selectorList: readonly string[]): Element | null {
  let firstMatch: Element | null = null;
  for (const selector of selectorList) {
    try {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (!firstMatch) firstMatch = el;
        if (isVisible(el)) return el;
      }
    } catch (e) {
      continue;
    }
  }
  return firstMatch;
}

/**
 * Query for all elements using multiple selector strategies
 */
export function queryAllElements(selectorList: readonly string[]): Element[] {
  const results: Element[] = [];
  const seen = new Set<Element>();

  for (const selector of selectorList) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          results.push(el);
        }
      });
    } catch (e) {
      // Invalid selector, try next
      continue;
    }
  }

  return results;
}

/**
 * Focus an element (works for both regular inputs and contenteditable)
 */
export function focusElement(element: Element): void {
  if (element instanceof HTMLElement) {
    element.focus();
    
    // For contenteditable, also place cursor at the end
    if (element.getAttribute('contenteditable') === 'true') {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false); // Collapse to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}

/**
 * Wait for an element to appear in the DOM
 */
export function waitForElement(
  selectorList: readonly string[],
  timeout = 2000
): Promise<Element | null> {
  return new Promise((resolve) => {
    // Check if already exists
    const existing = queryElement(selectorList);
    if (existing) {
      resolve(existing);
      return;
    }

    // Set up observer
    const observer = new MutationObserver(() => {
      const element = queryElement(selectorList);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout
    setTimeout(() => {
      observer.disconnect();
      resolve(queryElement(selectorList));
    }, timeout);
  });
}
