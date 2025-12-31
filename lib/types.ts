/**
 * Configuration for a single keyboard shortcut
 */
export interface ShortcutConfig {
  /** The key to press (e.g., "k", "s", "/") */
  key: string;
  /** Whether Cmd (Mac) / Ctrl (Win) must be pressed */
  metaKey: boolean;
  /** Whether Shift must be pressed */
  shiftKey: boolean;
  /** Whether Alt/Option must be pressed */
  altKey: boolean;
  /** Whether this shortcut is enabled */
  enabled: boolean;
}

/**
 * All available shortcut action IDs
 */
export type ShortcutActionId =
  | 'toggleSidebar'
  | 'focusInput'
  | 'showHelp'
  | 'copyLastResponse'
  | 'stopGeneration'
  | 'toggleModel'
  | 'toggleTheme';

/**
 * Map of all shortcuts with their configurations
 */
export type ShortcutsMap = Record<ShortcutActionId, ShortcutConfig>;

/**
 * Metadata about a shortcut action
 */
export interface ShortcutActionMeta {
  id: ShortcutActionId;
  label: string;
  description: string;
  /** Whether this is a Gemini built-in shortcut (we're just exposing it) */
  isBuiltIn?: boolean;
}

/**
 * Built-in Gemini shortcut (read-only, for display purposes)
 */
export interface BuiltInShortcut {
  label: string;
  description: string;
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * Storage schema for extension data
 */
export interface ExtensionStorage {
  shortcuts: ShortcutsMap;
  extensionEnabled: boolean;
}
