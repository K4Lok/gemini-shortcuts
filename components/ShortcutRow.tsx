import type { ShortcutActionMeta, ShortcutConfig } from '@/lib/types';
import { formatShortcutKeys, DEFAULT_SHORTCUTS } from '@/lib/defaults';
import { useShortcutsStore } from '@/stores/shortcuts';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortcutRowProps {
  action: ShortcutActionMeta;
  config: ShortcutConfig;
  isRecording: boolean;
}

export function ShortcutRow({ action, config, isRecording }: ShortcutRowProps) {
  const { toggleEnabled, resetShortcut, startRecording } = useShortcutsStore();

  const isDefault = JSON.stringify(config) === JSON.stringify(DEFAULT_SHORTCUTS[action.id]);
  const keys = formatShortcutKeys(config);

  const handleBadgeClick = () => {
    if (!isRecording) {
      startRecording(action.id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-2 rounded-lg transition-colors',
        isRecording && 'bg-primary/5 ring-2 ring-primary/20',
        !config.enabled && 'opacity-60'
      )}
    >
      {/* Left: Label and description */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{action.label}</div>
        <div className="text-xs text-muted-foreground truncate">{action.description}</div>
      </div>

      {/* Center: Shortcut keys */}
      <div className="flex items-center gap-2 mx-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleBadgeClick}
                className={cn(
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md p-1 -m-1',
                  'hover:bg-accent transition-colors',
                  isRecording && 'animate-pulse'
                )}
              >
                {isRecording ? (
                  <KbdGroup className="gap-1">
                    <Kbd className="px-2 bg-primary text-primary-foreground">Press keys...</Kbd>
                  </KbdGroup>
                ) : (
                  <KbdGroup className="gap-0.5">
                    {keys.map((key, index) => (
                      <Kbd key={index} className="font-mono text-base">
                        {key}
                      </Kbd>
                    ))}
                  </KbdGroup>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to record new shortcut</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Reset button (only show if not default) */}
        {!isDefault && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => resetShortcut(action.id)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to default</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Right: Enable/disable toggle */}
      <Switch
        checked={config.enabled}
        onCheckedChange={() => toggleEnabled(action.id)}
        aria-label={`Toggle ${action.label}`}
      />
    </div>
  );
}
