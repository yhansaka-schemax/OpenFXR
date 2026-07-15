import { AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { calcSpread, formatSpread } from '../utils/calcSpread.js';

const REFERENCE_SOURCES = ['CBSL', 'Market'];
const STALE_THRESHOLD_MS = 48 * 60 * 60 * 1000;

/**
 * @param {{ currency: string, sources: object|null, lastUpdated: Date|null }} props
 */
export function RateTable({ currency, sources, lastUpdated }) {
  if (!sources) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const cbslMid = sources['CBSL']?.[currency]?.mid ?? null;
  const cbslStale = lastUpdated
    ? Date.now() - lastUpdated.getTime() > STALE_THRESHOLD_MS
    : false;

  const rows = Object.entries(sources).map(([name, rates]) => ({
    name,
    ...rates[currency],
    isReference: REFERENCE_SOURCES.includes(name),
    spread: rates[currency]?.buy != null ? calcSpread(rates[currency].buy, cbslMid) : null,
  }));

  const refRows = rows.filter((r) => r.isReference);
  const bankRows = rows
    .filter((r) => !r.isReference)
    .sort((a, b) => (b.buy ?? -Infinity) - (a.buy ?? -Infinity));

  const bestBuyRate = Math.max(...bankRows.map((r) => r.buy ?? -Infinity));
  const bestSellRate = Math.min(...bankRows.map((r) => r.sell ?? Infinity));

  return (
    <div>
      {cbslStale && (
        <div className="mx-4 mt-3">
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" aria-hidden="true" />
              CBSL rate is stale (last updated over 48 hours ago)
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Buy (LKR)</TableHead>
            <TableHead className="text-right">Sell (LKR)</TableHead>
            <TableHead className="text-right">Mid (LKR)</TableHead>
            <TableHead className="text-right">Spread</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...refRows, ...bankRows].map((row) => (
            <TableRow key={row.name} className={cn(row.isReference && 'bg-muted/30')}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{row.name}</span>
                  {row.isReference && (
                    <span className="text-xs text-muted-foreground font-normal">(reference)</span>
                  )}
                  {!row.isReference && row.buy === bestBuyRate && bestBuyRate > -Infinity && (
                    <Badge className="bg-muted text-foreground border-border gap-1">
                      <span aria-hidden="true" className="text-green-500">●</span>Best Buy
                    </Badge>
                  )}
                  {!row.isReference && row.sell === bestSellRate && bestSellRate < Infinity && (
                    <Badge className="bg-muted text-foreground border-border gap-1">
                      <span aria-hidden="true" className="text-blue-500">●</span>Best Sell
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.buy != null ? row.buy.toFixed(2) : <span className="text-muted-foreground">N/A</span>}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.sell != null ? row.sell.toFixed(2) : <span className="text-muted-foreground">N/A</span>}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {row.mid != null ? row.mid.toFixed(2) : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className={cn(
                'text-right tabular-nums text-xs font-medium',
                row.spread == null ? 'text-muted-foreground' :
                row.spread >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              )}>
                {formatSpread(row.spread)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
