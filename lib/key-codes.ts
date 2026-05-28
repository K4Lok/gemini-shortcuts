/**
 * Normalize a KeyboardEvent into a stable key identifier.
 *
 * Problem: on macOS, `event.key` returns the *produced character* after the
 * Option-layer is applied — ⌥1 becomes "¡", ⌥2 becomes "™", ⌥3 becomes "£".
 * That makes `event.key` useless as a stable shortcut identifier whenever
 * Alt/Option is part of the chord.
 *
 * Solution: derive the key from `event.code` (the physical key on the board,
 * layout-independent), and fall back to `event.key` only for keys without
 * a meaningful code (rare in practice).
 *
 * Returned values are the canonical form we store and compare:
 *   - Letters: lowercase ("a", "b", …)
 *   - Digits:  "0"–"9"
 *   - Punctuation that lives on a single key: "/", ",", ".", ";", "'", "\\",
 *                                              "`", "-", "=", "[", "]"
 *   - Named keys: "Escape", "Tab", "Enter", "Backspace", "Delete", "Space",
 *                 "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
 *                 "F1"–"F12", "Home", "End", "PageUp", "PageDown", "Insert"
 */

const CODE_TO_KEY: Record<string, string> = {
  // Digits
  Digit0: '0', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4',
  Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9',

  // Numpad (treat as digits for matching purposes)
  Numpad0: '0', Numpad1: '1', Numpad2: '2', Numpad3: '3', Numpad4: '4',
  Numpad5: '5', Numpad6: '6', Numpad7: '7', Numpad8: '8', Numpad9: '9',

  // Punctuation
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
  Backquote: '`',

  // Named
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  Enter: 'Enter',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Insert: 'Insert',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

/**
 * Returns the canonical key identifier for a keyboard event, or null if the
 * event is a modifier-only press (Shift, Ctrl, Alt, Meta, etc.) that should
 * be ignored by the recorder.
 */
export function normalizeKeyFromEvent(event: KeyboardEvent): string | null {
  // Ignore modifier-only presses
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) return null;

  const code = event.code;

  // Letters: "KeyA" → "a"
  if (code.startsWith('Key') && code.length === 4) {
    return code.slice(3).toLowerCase();
  }

  // Function keys: "F1".."F24" come through unchanged in event.code
  if (/^F\d{1,2}$/.test(code)) return code;

  if (code in CODE_TO_KEY) return CODE_TO_KEY[code];

  // Fall back to event.key for anything we didn't map (rare). Lowercase
  // single-character keys so storage stays consistent.
  if (event.key.length === 1) return event.key.toLowerCase();
  return event.key;
}
