import type { ShortcutConfig } from './types';

/**
 * Known browser-reserved or commonly-conflicting keyboard shortcuts.
 *
 * Extensions can't query the browser's actual keymap, so this is a curated
 * list of the chords most likely to be eaten before our content script sees
 * them. We surface this as an inline warning, not a block — users may still
 * want to bind something that "usually" conflicts if it works for them.
 *
 * Match strategy: modifiers must match exactly, key matches case-insensitively.
 * Severity:
 *   - 'reserved'  → almost certainly intercepted by the browser
 *   - 'common'    → frequently reserved in Chromium-family browsers (Chrome/Arc/Brave/Edge)
 *   - 'arc'       → specifically reserved by Arc
 */

export type ConflictSeverity = 'reserved' | 'common' | 'arc';

interface ReservedChord {
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  /** Human-readable name of what the browser uses this for */
  usedFor: string;
  severity: ConflictSeverity;
}

// Mac-style modifier names below ("⌘" = meta on Mac, Ctrl on Win/Linux — the
// underlying check is just metaKey, so this works on both platforms.)
const RESERVED_CHORDS: ReservedChord[] = [
  // ── Chrome / Chromium core ────────────────────────────────────────────
  { key: 't', metaKey: true, shiftKey: false, altKey: false, usedFor: 'New tab', severity: 'reserved' },
  { key: 'w', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Close tab', severity: 'reserved' },
  { key: 'n', metaKey: true, shiftKey: false, altKey: false, usedFor: 'New window', severity: 'reserved' },
  { key: 'q', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Quit browser (Mac)', severity: 'reserved' },
  { key: 'r', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Reload page', severity: 'reserved' },
  { key: 'f', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Find in page', severity: 'reserved' },
  { key: 'p', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Print', severity: 'reserved' },
  { key: 'l', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Focus address bar', severity: 'reserved' },
  { key: 'd', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Bookmark page (Chrome) / Archive tab (Arc)', severity: 'reserved' },
  { key: 's', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Save page (Chrome) / Toggle sidebar (Arc)', severity: 'reserved' },
  { key: 'o', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Open file', severity: 'reserved' },
  { key: 'h', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Hide window (Mac)', severity: 'reserved' },
  { key: 'm', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Minimize window (Mac)', severity: 'reserved' },
  { key: ',', metaKey: true, shiftKey: false, altKey: false, usedFor: 'Browser settings', severity: 'reserved' },

  // ⌘⇧ chords commonly intercepted
  { key: 't', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Reopen closed tab', severity: 'reserved' },
  { key: 'n', metaKey: true, shiftKey: true, altKey: false, usedFor: 'New incognito/private window', severity: 'reserved' },
  { key: 'r', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Hard reload', severity: 'reserved' },
  { key: 'w', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Close window', severity: 'reserved' },
  { key: 'j', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Downloads (Chrome)', severity: 'common' },
  { key: 'b', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Toggle bookmarks bar', severity: 'common' },
  { key: 'a', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Tab search (Chrome)', severity: 'common' },
  { key: 'i', metaKey: true, shiftKey: true, altKey: false, usedFor: 'DevTools', severity: 'reserved' },
  { key: 'c', metaKey: true, shiftKey: true, altKey: false, usedFor: 'DevTools inspect / Copy URL (Arc)', severity: 'common' },

  // ⌘+digit → tab switching (1–8 = nth tab, 9 = last tab)
  ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d): ReservedChord => ({
    key: d, metaKey: true, shiftKey: false, altKey: false,
    usedFor: `Switch to tab ${d}`, severity: 'reserved',
  })),
  // ⌘⇧+digit → also tab switching in Arc (and used by Chromium for some bindings)
  ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d): ReservedChord => ({
    key: d, metaKey: true, shiftKey: true, altKey: false,
    usedFor: `Tab/space switching (Arc, some Chromium variants)`, severity: 'arc',
  })),

  // ── Arc-specific (in addition to ones already listed above) ───────────
  { key: 'e', metaKey: true, shiftKey: false, altKey: false, usedFor: 'New Little Arc window', severity: 'arc' },
  { key: 'd', metaKey: true, shiftKey: true, altKey: false, usedFor: 'Close tab (Arc)', severity: 'arc' },
  { key: 'c', metaKey: true, shiftKey: false, altKey: true, usedFor: 'Copy URL (Arc)', severity: 'arc' },
];

function matches(a: Pick<ShortcutConfig, 'key' | 'metaKey' | 'shiftKey' | 'altKey'>, b: ReservedChord): boolean {
  return (
    a.key.toLowerCase() === b.key.toLowerCase() &&
    a.metaKey === b.metaKey &&
    a.shiftKey === b.shiftKey &&
    a.altKey === b.altKey
  );
}

export interface ConflictWarning {
  usedFor: string;
  severity: ConflictSeverity;
}

/**
 * Returns a conflict warning if this chord matches a known browser-reserved
 * shortcut, or null if it appears safe.
 */
export function getConflictWarning(
  config: Pick<ShortcutConfig, 'key' | 'metaKey' | 'shiftKey' | 'altKey'>
): ConflictWarning | null {
  if (!config.key) return null;
  const hit = RESERVED_CHORDS.find((r) => matches(config, r));
  return hit ? { usedFor: hit.usedFor, severity: hit.severity } : null;
}
