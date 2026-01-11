import type { ShortcutsMap, ShortcutActionId, ShortcutConfig } from '@/lib/types';
import { loadShortcuts, isExtensionEnabled, onStorageChange } from '@/lib/storage';
import { executeAction } from '@/lib/actions';
import { SELECTORS, queryElement } from '@/lib/selectors';
import { toggleHelpOverlay, isHelpOverlayVisible } from '@/lib/help-overlay';

export default defineContentScript({
  matches: ['*://gemini.google.com/*'],
  async main() {
    console.log('[Gemini Shortcuts] Content script loaded');

    // Load initial state
    let shortcuts = await loadShortcuts();
    let extensionEnabled = await isExtensionEnabled();

    // Listen for storage changes to update shortcuts in real-time
    onStorageChange((changes) => {
      if (changes.shortcuts) {
        shortcuts = changes.shortcuts;
        console.log('[Gemini Shortcuts] Shortcuts updated');
      }
      if (changes.extensionEnabled !== undefined) {
        extensionEnabled = changes.extensionEnabled;
        console.log('[Gemini Shortcuts] Extension enabled:', extensionEnabled);
      }
    });

    // Check if user is typing in an input field
    function isTypingInInput(event: KeyboardEvent): boolean {
      const target = event.target as HTMLElement;

      // Check if target is an input, textarea, or contenteditable
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true' ||
        target.getAttribute('contenteditable') === 'plaintext-only' ||
        target.isContentEditable
      ) {
        return true;
      }

      // Check if inside a contenteditable parent
      if (target.closest('[contenteditable="true"]')) {
        return true;
      }

      return false;
    }

    // Check if a keyboard event matches a shortcut config
    function matchesShortcut(event: KeyboardEvent, config: ShortcutConfig): boolean {
      // Normalize key comparison (case insensitive for single characters)
      const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const configKey = config.key.length === 1 ? config.key.toLowerCase() : config.key;

      // Check key match
      if (eventKey !== configKey) {
        return false;
      }

      // Check modifiers
      // Use metaKey on Mac, ctrlKey on Windows/Linux
      const isMac = navigator.platform.includes('Mac');
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      if (config.metaKey !== modifierKey) {
        return false;
      }

      if (config.shiftKey !== event.shiftKey) {
        return false;
      }

      if (config.altKey !== event.altKey) {
        return false;
      }

      return true;
    }

    // Find which action matches the keyboard event
    function findMatchingAction(
      event: KeyboardEvent,
      shortcuts: ShortcutsMap
    ): ShortcutActionId | null {
      for (const [actionId, config] of Object.entries(shortcuts)) {
        if (config.enabled && matchesShortcut(event, config)) {
          return actionId as ShortcutActionId;
        }
      }
      return null;
    }

    // Special shortcuts that work even when typing in input fields
    // These use modifier keys so they won't interfere with normal typing
    const TYPING_ALLOWED_ACTIONS: ShortcutActionId[] = [
      'showHelp',
      'stopGeneration',
      'toggleModel',
      'toggleTheme',
      'copyLastResponse',
      'toggleSidebar',
      'toggleTemporaryChat',
    ];

    // Main keyboard event handler
    function handleKeyDown(event: KeyboardEvent): void {
      // Skip if extension is disabled
      if (!extensionEnabled) {
        return;
      }

      // If help overlay is visible, let it handle ESC key
      // The overlay has its own ESC handler with higher priority
      if (isHelpOverlayVisible() && event.key === 'Escape') {
        return;
      }

      // Find matching action
      const matchedAction = findMatchingAction(event, shortcuts);

      if (!matchedAction) {
        return;
      }

      // Check if we should process this shortcut while typing
      const isTyping = isTypingInInput(event);

      if (isTyping && !TYPING_ALLOWED_ACTIONS.includes(matchedAction)) {
        // Special case: "/" to focus input should work if not already in the prompt
        if (matchedAction === 'focusInput') {
          const promptInput = queryElement(SELECTORS.promptInput);
          if (event.target === promptInput) {
            // Already in prompt, let the "/" be typed
            return;
          }
        } else {
          return;
        }
      }

      // Prevent default and execute action
      event.preventDefault();
      event.stopPropagation();

      const result = executeAction(matchedAction);

      if (!result.success && result.message) {
        console.warn(`[Gemini Shortcuts] ${matchedAction}: ${result.message}`);
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown, true);

    // Listen for help overlay toggle event
    window.addEventListener('gemini-shortcuts:toggle-help', () => {
      toggleHelpOverlay(shortcuts);
    });

    console.log('[Gemini Shortcuts] Keyboard listener active');
  },
});
