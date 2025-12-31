import type { ShortcutsMap } from './types';
import { SHORTCUT_ACTIONS, BUILTIN_SHORTCUTS, formatShortcutKeys } from './defaults';

const OVERLAY_ID = 'gemini-shortcuts-help-overlay';

// Store reference to the escape handler for proper cleanup
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

/**
 * Create and inject the help overlay into the page
 */
export function createHelpOverlay(shortcuts: ShortcutsMap): void {
  // Remove existing overlay if present
  removeHelpOverlay();

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = `
    <style>
      #${OVERLAY_ID} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        animation: gsh-fadeIn 0.15s ease-out;
        font-family: 'Google Sans', system-ui, -apple-system, sans-serif;
      }

      @keyframes gsh-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes gsh-slideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .gsh-modal {
        background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
        border-radius: 20px;
        padding: 28px 32px;
        max-width: 580px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 25px 80px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
        animation: gsh-slideUp 0.2s ease-out;
      }

      .gsh-modal::-webkit-scrollbar {
        width: 8px;
      }
      .gsh-modal::-webkit-scrollbar-track {
        background: transparent;
      }
      .gsh-modal::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      .gsh-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .gsh-title {
        display: flex;
        align-items: center;
        gap: 14px;
        color: #fff;
        font-size: 22px;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .gsh-icon {
        width: 28px;
        height: 28px;
        color: #8ab4f8;
      }

      .gsh-close {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #9aa0a6;
        cursor: pointer;
        padding: 10px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }

      .gsh-close:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
      }

      .gsh-section {
        margin-bottom: 24px;
      }

      .gsh-section:last-child {
        margin-bottom: 0;
      }

      .gsh-section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #9aa0a6;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
        padding-left: 4px;
      }

      .gsh-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .gsh-badge-builtin {
        background: rgba(251, 188, 4, 0.15);
        color: #fdd663;
        border: 1px solid rgba(251, 188, 4, 0.3);
      }

      .gsh-badge-extension {
        background: rgba(138, 180, 248, 0.15);
        color: #8ab4f8;
        border: 1px solid rgba(138, 180, 248, 0.3);
      }

      .gsh-shortcuts {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .gsh-shortcut {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.15s;
      }

      .gsh-shortcut:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .gsh-shortcut.disabled {
        opacity: 0.4;
      }

      .gsh-shortcut-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .gsh-shortcut-label {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }

      .gsh-shortcut-desc {
        color: #9aa0a6;
        font-size: 12px;
      }

      .gsh-keys {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .gsh-kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-bottom-width: 2px;
        border-radius: 6px;
        color: #e8eaed;
        font-family: 'SF Mono', 'Roboto Mono', ui-monospace, monospace;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .gsh-kbd-plus {
        color: #5f6368;
        font-size: 12px;
        margin: 0 2px;
      }

      .gsh-footer {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        text-align: center;
        color: #9aa0a6;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .gsh-footer .gsh-kbd {
        height: 24px;
        min-width: 24px;
        font-size: 11px;
      }
    </style>
    <div class="gsh-modal">
      <div class="gsh-header">
        <h2 class="gsh-title">
          <svg class="gsh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" ry="2"/>
            <path d="M6 8h.001"/>
            <path d="M10 8h.001"/>
            <path d="M14 8h.001"/>
            <path d="M18 8h.001"/>
            <path d="M8 12h.001"/>
            <path d="M12 12h.001"/>
            <path d="M16 12h.001"/>
            <path d="M7 16h10"/>
          </svg>
          Keyboard Shortcuts
        </h2>
        <button class="gsh-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Built-in Gemini Shortcuts (shown first) -->
      <div class="gsh-section">
        <div class="gsh-section-title">
          <span class="gsh-badge gsh-badge-builtin">Gemini</span>
          Built-in Shortcuts
        </div>
        <div class="gsh-shortcuts">
          ${BUILTIN_SHORTCUTS.map((shortcut) => {
            const keys = formatShortcutKeys(shortcut);
            return `
              <div class="gsh-shortcut">
                <div class="gsh-shortcut-info">
                  <span class="gsh-shortcut-label">${shortcut.label}</span>
                  <span class="gsh-shortcut-desc">${shortcut.description}</span>
                </div>
                <div class="gsh-keys">
                  ${keys.map((k) => `<span class="gsh-kbd">${k}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Extension Shortcuts -->
      <div class="gsh-section">
        <div class="gsh-section-title">
          <span class="gsh-badge gsh-badge-extension">Extension</span>
          Custom Shortcuts
        </div>
        <div class="gsh-shortcuts">
          ${SHORTCUT_ACTIONS.map((action) => {
            const config = shortcuts[action.id];
            const keys = formatShortcutKeys(config);
            return `
              <div class="gsh-shortcut ${!config.enabled ? 'disabled' : ''}">
                <div class="gsh-shortcut-info">
                  <span class="gsh-shortcut-label">${action.label}</span>
                  <span class="gsh-shortcut-desc">${action.description}</span>
                </div>
                <div class="gsh-keys">
                  ${keys.map((k, i) => `<span class="gsh-kbd">${k}</span>${i < keys.length - 1 ? '' : ''}`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="gsh-footer">
        Press <span class="gsh-kbd">Esc</span> or click outside to close
      </div>
    </div>
  `;

  // Close on click outside or close button
  overlay.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === overlay || target.closest('.gsh-close')) {
      e.preventDefault();
      e.stopPropagation();
      removeHelpOverlay();
    }
  });

  // Create escape handler with highest priority
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      removeHelpOverlay();
    }
  };

  // Add with capture phase and highest priority
  document.addEventListener('keydown', escapeHandler, true);
  window.addEventListener('keydown', escapeHandler, true);

  document.body.appendChild(overlay);
}

/**
 * Remove the help overlay from the page
 */
export function removeHelpOverlay(): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }

  // Clean up escape handler
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler, true);
    window.removeEventListener('keydown', escapeHandler, true);
    escapeHandler = null;
  }
}

/**
 * Toggle the help overlay
 */
export function toggleHelpOverlay(shortcuts: ShortcutsMap): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    removeHelpOverlay();
  } else {
    createHelpOverlay(shortcuts);
  }
}

/**
 * Check if help overlay is currently visible
 */
export function isHelpOverlayVisible(): boolean {
  return document.getElementById(OVERLAY_ID) !== null;
}
