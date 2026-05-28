import { useEffect } from 'react';
import { useShortcutsStore } from '@/stores/shortcuts';
import { SHORTCUT_ACTIONS, formatShortcutKeys, DEFAULT_SHORTCUTS } from '@/lib/defaults';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { Keyboard, ExternalLink, RotateCcw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getConflictWarning } from '@/lib/reserved-keys';
import { normalizeKeyFromEvent } from '@/lib/key-codes';

function App() {
  const {
    shortcuts,
    extensionEnabled,
    recording,
    isLoading,
    loadShortcuts,
    toggleEnabled,
    resetShortcut,
    setExtensionEnabled,
    startRecording,
    stopRecording,
    recordShortcut,
  } = useShortcutsStore();

  useEffect(() => {
    loadShortcuts();
  }, [loadShortcuts]);

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const key = normalizeKeyFromEvent(event);
      if (!key) return; // modifier-only press

      if (
        key === 'Escape' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        stopRecording();
        return;
      }

      const isMac = navigator.platform.includes('Mac');
      const metaKey = isMac ? event.metaKey : event.ctrlKey;

      recordShortcut({
        key,
        metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [recording, stopRecording, recordShortcut]);

  const openGemini = () => {
    browser.tabs.create({ url: 'https://gemini.google.com/' });
  };

  if (isLoading) {
    return (
      <div className="w-96 p-4 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const enabledCount = SHORTCUT_ACTIONS.filter(
    (action) => shortcuts[action.id].enabled
  ).length;

  return (
    <div className="w-96 bg-background">
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
            onCheckedChange={setExtensionEnabled}
            aria-label="Toggle extension"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {extensionEnabled
            ? `${enabledCount} of ${SHORTCUT_ACTIONS.length} shortcuts active`
            : 'Shortcuts disabled'}
        </p>
      </div>

      {/* Shortcuts List */}
      <div className="p-2 max-h-[420px] overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground mb-1 px-2 pt-1 uppercase tracking-wide">
          Shortcuts — click chord to rebind
        </div>
        <div className="space-y-0.5">
          {SHORTCUT_ACTIONS.map((action) => {
            const config = shortcuts[action.id];
            const keys = formatShortcutKeys(config);
            const isRecording = recording === action.id;
            const isDefault =
              JSON.stringify(config) === JSON.stringify(DEFAULT_SHORTCUTS[action.id]);
            const hasKey = config.key && config.key.length > 0;
            const conflict =
              config.enabled && hasKey ? getConflictWarning(config) : null;

            return (
              <div
                key={action.id}
                className={cn(
                  'flex items-center gap-2 py-1.5 px-2 rounded transition-colors',
                  isRecording && 'bg-primary/5 ring-1 ring-primary/30',
                  !config.enabled && 'opacity-60'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{action.label}</div>
                  {conflict && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-[10.5px] leading-tight mt-0.5',
                        conflict.severity === 'reserved'
                          ? 'text-destructive'
                          : 'text-amber-600 dark:text-amber-500'
                      )}
                      title={`Browser uses this for: ${conflict.usedFor}. Click the chord to rebind.`}
                    >
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {conflict.severity === 'arc'
                          ? 'May conflict in Arc — '
                          : conflict.severity === 'reserved'
                            ? 'Reserved by browser — '
                            : 'Often reserved — '}
                        {conflict.usedFor}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => !isRecording && startRecording(action.id)}
                  className={cn(
                    'shrink-0 rounded px-1.5 py-0.5 hover:bg-accent transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary/40',
                    isRecording && 'animate-pulse'
                  )}
                  title={isRecording ? 'Press keys (Esc to cancel)' : 'Click to record'}
                >
                  {isRecording ? (
                    <span className="text-xs text-primary font-medium px-1">
                      Press keys…
                    </span>
                  ) : hasKey ? (
                    <KbdGroup className="gap-0.5">
                      {keys.map((key, index) => (
                        <Kbd key={index} className="font-mono text-xs">
                          {key}
                        </Kbd>
                      ))}
                    </KbdGroup>
                  ) : (
                    <span className="text-xs text-muted-foreground italic px-1">
                      unbound
                    </span>
                  )}
                </button>

                {!isDefault && !isRecording && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => resetShortcut(action.id)}
                    title="Reset to default"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}

                <Switch
                  checked={config.enabled}
                  onCheckedChange={() => toggleEnabled(action.id)}
                  aria-label={`Toggle ${action.label}`}
                  className="shrink-0 scale-75"
                />
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Footer Actions */}
      <div className="p-3">
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-1.5"
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
