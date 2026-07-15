import { Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from '../utils/formatTime.js';

/**
 * @param {{ lastUpdated: Date|null, loading: boolean, theme: string, toggleTheme: () => void }} props
 */
export function Header({ lastUpdated, loading, theme, toggleTheme }) {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">FXRScout</span>
          <Badge variant="success">🇱🇰 Sri Lanka</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : lastUpdated ? (
              <span>Updated {formatDistanceToNow(lastUpdated)}</span>
            ) : (
              <span>No data</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-8 w-8"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
