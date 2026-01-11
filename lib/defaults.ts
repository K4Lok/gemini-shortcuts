import type { ShortcutsMap, ShortcutActionMeta, ShortcutActionId, BuiltInShortcut } from './types';

/**
 * Default shortcut configurations
 * These are the out-of-box shortcuts that users can customize
 */
export const DEFAULT_SHORTCUTS: ShortcutsMap = {
  toggleSidebar: {
    key: 's',
    metaKey: true,
    shiftKey: true,
    altKey: false,
    enabled: true,
  },
  focusInput: {
    key: '/',
    metaKey: false,
    shiftKey: false,
    altKey: false,
    enabled: true,
  },
  showHelp: {
    key: '/',
    metaKey: true,
    shiftKey: false,
    altKey: false,
    enabled: true,
  },
  copyLastResponse: {
    key: 'c',
    metaKey: true,
    shiftKey: true,
    altKey: false,
    enabled: true,
  },
  stopGeneration: {
    key: 'Escape',
    metaKey: false,
    shiftKey: false,
    altKey: false,
    enabled: true,
  },
  toggleModel: {
    key: 'm',
    metaKey: true,
    shiftKey: true,
    altKey: false,
    enabled: true,
  },
  toggleTheme: {
    key: 'l',
    metaKey: true,
    shiftKey: true,
    altKey: false,
    enabled: true,
  },
  toggleTemporaryChat: {
    key: 'p',
    metaKey: true,
    shiftKey: true,
    altKey: false,
    enabled: true,
  },
};

/**
 * Metadata for each shortcut action (for UI display)
 * Order: Show Help, Focus Input, Toggle Sidebar, Toggle Model, Stop, Copy, Theme
 */
export const SHORTCUT_ACTIONS: ShortcutActionMeta[] = [
  {
    id: 'showHelp',
    label: 'Show Help',
    description: 'Display keyboard shortcuts overlay',
  },
  {
    id: 'focusInput',
    label: 'Focus Input',
    description: 'Focus the main prompt textarea',
  },
  {
    id: 'toggleSidebar',
    label: 'Toggle Sidebar',
    description: 'Show or hide the sidebar',
  },
  {
    id: 'toggleModel',
    label: 'Toggle Model',
    description: 'Cycle through Fast / Thinking / Pro modes',
  },
  {
    id: 'stopGeneration',
    label: 'Stop Generation',
    description: 'Stop the current response generation',
  },
  {
    id: 'copyLastResponse',
    label: 'Copy Last Response',
    description: 'Copy the most recent AI response',
  },
  {
    id: 'toggleTheme',
    label: 'Toggle Theme',
    description: 'Cycle through System / Light / Dark themes',
  },
  {
    id: 'toggleTemporaryChat',
    label: 'Toggle Temporary Chat',
    description: 'Toggle temporary chat mode (chats not saved to history)',
  },
];

/**
 * Built-in Gemini shortcuts (cannot be customized, just displayed for reference)
 */
export const BUILTIN_SHORTCUTS: BuiltInShortcut[] = [
  {
    label: 'New Chat',
    description: 'Gemini built-in new chat',
    key: 'o',
    metaKey: true,
    shiftKey: true,
    altKey: false,
  },
  {
    label: 'Search Conversations',
    description: 'Gemini built-in search',
    key: 'k',
    metaKey: true,
    shiftKey: true,
    altKey: false,
  },
];

/**
 * Get action metadata by ID
 */
export function getActionMeta(id: ShortcutActionId): ShortcutActionMeta | undefined {
  return SHORTCUT_ACTIONS.find((action) => action.id === id);
}

/**
 * Format a shortcut configuration to a human-readable string
 */
export function formatShortcut(config: {
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): string {
  const parts: string[] = [];
  
  // Use platform-specific modifier symbols
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  
  if (config.metaKey) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (config.altKey) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (config.shiftKey) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  
  // Format the key nicely
  let keyDisplay = config.key;
  if (config.key === 'Escape') {
    keyDisplay = 'Esc';
  } else if (config.key === ' ') {
    keyDisplay = 'Space';
  } else if (config.key.length === 1) {
    keyDisplay = config.key.toUpperCase();
  }
  
  parts.push(keyDisplay);
  
  return parts.join(isMac ? '' : '+');
}

/**
 * Format shortcut keys as an array for kbd display
 */
export function formatShortcutKeys(config: {
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): string[] {
  const parts: string[] = [];
  
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  
  if (config.metaKey) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (config.altKey) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (config.shiftKey) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  
  let keyDisplay = config.key;
  if (config.key === 'Escape') {
    keyDisplay = 'Esc';
  } else if (config.key === ' ') {
    keyDisplay = 'Space';
  } else if (config.key.length === 1) {
    keyDisplay = config.key.toUpperCase();
  }
  
  parts.push(keyDisplay);
  
  return parts;
}
