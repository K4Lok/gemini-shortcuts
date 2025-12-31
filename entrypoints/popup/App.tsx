import { useEffect, useState } from 'react';
import type { ShortcutsMap } from '@/lib/types';
import { loadShortcuts, isExtensionEnabled, setExtensionEnabled } from '@/lib/storage';
import { SHORTCUT_ACTIONS, formatShortcutKeys } from '@/lib/defaults';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { Keyboard, Settings, ExternalLink } from 'lucide-react';

function App() {
  const [shortcuts, setShortcuts] = useState<ShortcutsMap | null>(null);
  const [extensionEnabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [loadedShortcuts, enabled] = await Promise.all([
        loadShortcuts(),
        isExtensionEnabled(),
      ]);
      setShortcuts(loadedShortcuts);
      setEnabled(enabled);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleToggleEnabled = async () => {
    const newValue = !extensionEnabled;
    setEnabled(newValue);
    await setExtensionEnabled(newValue);
  };

  const openOptionsPage = () => {
    browser.runtime.openOptionsPage();
  };

  const openGemini = () => {
    browser.tabs.create({ url: 'https://gemini.google.com/' });
  };

  if (isLoading || !shortcuts) {
    return (
      <div className="w-80 p-4 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const enabledShortcuts = SHORTCUT_ACTIONS.filter(
    (action) => shortcuts[action.id].enabled
  );

  return (
    <div className="w-80 bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Keyboard className="h-4 w-4 text-primary" />
            </div>
            <h1 className="font-semibold text-sm">Gemini Shortcuts</h1>
          </div>
          <Switch
            checked={extensionEnabled}
            onCheckedChange={handleToggleEnabled}
            aria-label="Toggle extension"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {extensionEnabled
            ? `${enabledShortcuts.length} shortcuts active`
            : 'Shortcuts disabled'}
        </p>
      </div>

      {/* Shortcuts List */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Quick Reference
        </div>
        <div className="space-y-1">
          {enabledShortcuts.slice(0, 6).map((action) => {
            const keys = formatShortcutKeys(shortcuts[action.id]);
            return (
              <div
                key={action.id}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm truncate mr-2">{action.label}</span>
                <KbdGroup className="gap-0.5 shrink-0">
                  {keys.map((key, index) => (
                    <Kbd key={index} className="font-mono">
                      {key}
                    </Kbd>
                  ))}
                </KbdGroup>
              </div>
            );
          })}
          {enabledShortcuts.length > 6 && (
            <div className="text-xs text-muted-foreground text-center py-1">
              +{enabledShortcuts.length - 6} more shortcuts
            </div>
          )}
          {enabledShortcuts.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No shortcuts enabled
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Footer Actions */}
      <div className="p-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={openOptionsPage}
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={openGemini}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Gemini
        </Button>
      </div>
    </div>
  );
}

export default App;
