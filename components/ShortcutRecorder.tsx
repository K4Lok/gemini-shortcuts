import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutRecorderProps {
  isOpen: boolean;
  onCancel: () => void;
}

export function ShortcutRecorder({ isOpen, onCancel }: ShortcutRecorderProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Recording Shortcut
          </DialogTitle>
          <DialogDescription>
            Press the key combination you want to use for this shortcut.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative p-8 bg-primary/10 rounded-full">
              <Keyboard className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd> to cancel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

