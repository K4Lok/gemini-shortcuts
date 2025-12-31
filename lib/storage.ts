import type { ShortcutsMap, ShortcutActionId, ExtensionStorage } from './types';
import { DEFAULT_SHORTCUTS } from './defaults';

const STORAGE_KEYS = {
  SHORTCUTS: 'shortcuts',
  EXTENSION_ENABLED: 'extensionEnabled',
} as const;

/**
 * Load shortcuts from storage, merging with defaults
 */
export async function loadShortcuts(): Promise<ShortcutsMap> {
  try {
    const result = await browser.storage.sync.get(STORAGE_KEYS.SHORTCUTS);
    const stored = result[STORAGE_KEYS.SHORTCUTS] as Partial<ShortcutsMap> | undefined;
    
    if (!stored) {
      return { ...DEFAULT_SHORTCUTS };
    }
    
    // Merge stored shortcuts with defaults (in case new shortcuts are added)
    return {
      ...DEFAULT_SHORTCUTS,
      ...stored,
    };
  } catch (error) {
    console.error('Failed to load shortcuts:', error);
    return { ...DEFAULT_SHORTCUTS };
  }
}

/**
 * Save shortcuts to storage
 */
export async function saveShortcuts(shortcuts: ShortcutsMap): Promise<void> {
  try {
    await browser.storage.sync.set({
      [STORAGE_KEYS.SHORTCUTS]: shortcuts,
    });
  } catch (error) {
    console.error('Failed to save shortcuts:', error);
    throw error;
  }
}

/**
 * Update a single shortcut
 */
export async function updateShortcut(
  actionId: ShortcutActionId,
  config: Partial<ShortcutsMap[ShortcutActionId]>
): Promise<ShortcutsMap> {
  const shortcuts = await loadShortcuts();
  shortcuts[actionId] = {
    ...shortcuts[actionId],
    ...config,
  };
  await saveShortcuts(shortcuts);
  return shortcuts;
}

/**
 * Reset a single shortcut to its default configuration
 */
export async function resetShortcut(actionId: ShortcutActionId): Promise<ShortcutsMap> {
  const shortcuts = await loadShortcuts();
  shortcuts[actionId] = { ...DEFAULT_SHORTCUTS[actionId] };
  await saveShortcuts(shortcuts);
  return shortcuts;
}

/**
 * Reset all shortcuts to their default configurations
 */
export async function resetAllShortcuts(): Promise<ShortcutsMap> {
  const defaults = { ...DEFAULT_SHORTCUTS };
  await saveShortcuts(defaults);
  return defaults;
}

/**
 * Check if the extension is globally enabled
 */
export async function isExtensionEnabled(): Promise<boolean> {
  try {
    const result = await browser.storage.sync.get(STORAGE_KEYS.EXTENSION_ENABLED);
    // Default to enabled if not set
    return result[STORAGE_KEYS.EXTENSION_ENABLED] !== false;
  } catch (error) {
    console.error('Failed to load extension enabled state:', error);
    return true;
  }
}

/**
 * Set the extension enabled state
 */
export async function setExtensionEnabled(enabled: boolean): Promise<void> {
  try {
    await browser.storage.sync.set({
      [STORAGE_KEYS.EXTENSION_ENABLED]: enabled,
    });
  } catch (error) {
    console.error('Failed to save extension enabled state:', error);
    throw error;
  }
}

/**
 * Listen for storage changes
 */
export function onStorageChange(
  callback: (changes: { shortcuts?: ShortcutsMap; extensionEnabled?: boolean }) => void
): () => void {
  const listener = (
    changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
    areaName: string
  ) => {
    if (areaName !== 'sync') return;

    const result: { shortcuts?: ShortcutsMap; extensionEnabled?: boolean } = {};

    if (changes[STORAGE_KEYS.SHORTCUTS]) {
      result.shortcuts = changes[STORAGE_KEYS.SHORTCUTS].newValue as ShortcutsMap;
    }

    if (changes[STORAGE_KEYS.EXTENSION_ENABLED]) {
      result.extensionEnabled = changes[STORAGE_KEYS.EXTENSION_ENABLED].newValue as boolean;
    }

    if (Object.keys(result).length > 0) {
      callback(result);
    }
  };

  browser.storage.onChanged.addListener(listener);

  // Return cleanup function
  return () => {
    browser.storage.onChanged.removeListener(listener);
  };
}

