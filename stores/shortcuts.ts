import { create } from 'zustand';
import type { ShortcutsMap, ShortcutActionId, ShortcutConfig } from '@/lib/types';
import { DEFAULT_SHORTCUTS } from '@/lib/defaults';
import {
  loadShortcuts,
  saveShortcuts,
  isExtensionEnabled,
  setExtensionEnabled,
} from '@/lib/storage';

interface ShortcutsStore {
  // State
  shortcuts: ShortcutsMap;
  extensionEnabled: boolean;
  recording: ShortcutActionId | null;
  isLoading: boolean;

  // Actions
  loadShortcuts: () => Promise<void>;
  updateShortcut: (actionId: ShortcutActionId, config: Partial<ShortcutConfig>) => Promise<void>;
  resetShortcut: (actionId: ShortcutActionId) => Promise<void>;
  resetAll: () => Promise<void>;
  toggleEnabled: (actionId: ShortcutActionId) => Promise<void>;
  setExtensionEnabled: (enabled: boolean) => Promise<void>;
  startRecording: (actionId: ShortcutActionId) => void;
  stopRecording: () => void;
  recordShortcut: (config: Omit<ShortcutConfig, 'enabled'>) => Promise<void>;
}

export const useShortcutsStore = create<ShortcutsStore>((set, get) => ({
  // Initial state
  shortcuts: { ...DEFAULT_SHORTCUTS },
  extensionEnabled: true,
  recording: null,
  isLoading: true,

  // Load shortcuts from storage
  loadShortcuts: async () => {
    set({ isLoading: true });
    try {
      const [shortcuts, enabled] = await Promise.all([
        loadShortcuts(),
        isExtensionEnabled(),
      ]);
      set({ shortcuts, extensionEnabled: enabled, isLoading: false });
    } catch (error) {
      console.error('Failed to load shortcuts:', error);
      set({ isLoading: false });
    }
  },

  // Update a single shortcut property
  updateShortcut: async (actionId, config) => {
    const { shortcuts } = get();
    const updated: ShortcutsMap = {
      ...shortcuts,
      [actionId]: {
        ...shortcuts[actionId],
        ...config,
      },
    };
    set({ shortcuts: updated });
    await saveShortcuts(updated);
  },

  // Reset a single shortcut to default
  resetShortcut: async (actionId) => {
    const { shortcuts } = get();
    const updated: ShortcutsMap = {
      ...shortcuts,
      [actionId]: { ...DEFAULT_SHORTCUTS[actionId] },
    };
    set({ shortcuts: updated });
    await saveShortcuts(updated);
  },

  // Reset all shortcuts to defaults
  resetAll: async () => {
    const defaults = { ...DEFAULT_SHORTCUTS };
    set({ shortcuts: defaults });
    await saveShortcuts(defaults);
  },

  // Toggle a shortcut's enabled state
  toggleEnabled: async (actionId) => {
    const { shortcuts } = get();
    const updated: ShortcutsMap = {
      ...shortcuts,
      [actionId]: {
        ...shortcuts[actionId],
        enabled: !shortcuts[actionId].enabled,
      },
    };
    set({ shortcuts: updated });
    await saveShortcuts(updated);
  },

  // Set extension enabled/disabled
  setExtensionEnabled: async (enabled) => {
    set({ extensionEnabled: enabled });
    await setExtensionEnabled(enabled);
  },

  // Start recording a new shortcut
  startRecording: (actionId) => {
    set({ recording: actionId });
  },

  // Stop recording
  stopRecording: () => {
    set({ recording: null });
  },

  // Record a new shortcut from keyboard event
  recordShortcut: async (config) => {
    const { recording, shortcuts } = get();
    if (!recording) return;

    const updated: ShortcutsMap = {
      ...shortcuts,
      [recording]: {
        ...config,
        enabled: shortcuts[recording].enabled,
      },
    };

    set({ shortcuts: updated, recording: null });
    await saveShortcuts(updated);
  },
}));

