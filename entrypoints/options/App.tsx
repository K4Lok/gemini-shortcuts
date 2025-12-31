import { useEffect } from 'react';
import { useShortcutsStore } from '@/stores/shortcuts';
import { SHORTCUT_ACTIONS, formatShortcut } from '@/lib/defaults';
import { ShortcutRow } from '@/components/ShortcutRow';
import { ShortcutRecorder } from '@/components/ShortcutRecorder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Keyboard, RotateCcw, Settings } from 'lucide-react';

function App() {
  const {
    shortcuts,
    extensionEnabled,
    recording,
    isLoading,
    loadShortcuts,
    resetAll,
    setExtensionEnabled,
    stopRecording,
    recordShortcut,
  } = useShortcutsStore();

  useEffect(() => {
    loadShortcuts();
  }, [loadShortcuts]);

  // Handle keyboard events for recording
  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Skip modifier-only keys
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
        return;
      }

      // Escape cancels recording
      if (event.key === 'Escape' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        stopRecording();
        return;
      }

      const isMac = navigator.platform.includes('Mac');
      const metaKey = isMac ? event.metaKey : event.ctrlKey;

      recordShortcut({
        key: event.key,
        metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [recording, stopRecording, recordShortcut]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Keyboard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Gemini Shortcuts</h1>
          </div>
          <p className="text-muted-foreground">
            Customize keyboard shortcuts for Google Gemini
          </p>
        </div>

        {/* Master Toggle Card */}
        <Card className="mb-6 border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Extension Status</CardTitle>
                  <CardDescription>
                    {extensionEnabled ? 'Shortcuts are active' : 'Shortcuts are disabled'}
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={extensionEnabled}
                onCheckedChange={setExtensionEnabled}
                aria-label="Toggle extension"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Shortcuts Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>
                  Click on a shortcut to record a new key combination
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAll}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {SHORTCUT_ACTIONS.map((action, index) => (
                <div key={action.id}>
                  <ShortcutRow
                    action={action}
                    config={shortcuts[action.id]}
                    isRecording={recording === action.id}
                  />
                  {index < SHORTCUT_ACTIONS.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Press the shortcut badge to record a new key combination.</p>
          <p className="mt-1">Press Esc while recording to cancel.</p>
        </div>
      </div>

      {/* Recording Overlay */}
      <ShortcutRecorder isOpen={recording !== null} onCancel={stopRecording} />
    </div>
  );
}

export default App;

