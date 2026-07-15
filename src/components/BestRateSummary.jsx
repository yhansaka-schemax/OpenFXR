import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @param {{ currency: string, sources: object|null }} props
 */
export function BestRateSummary({ currency, sources }) {
  if (!sources) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    );
  }

  let bestBuy = null;
  let bestBuyRate = -Infinity;
  let bestSell = null;
  let bestSellRate = Infinity;

  for (const [name, rates] of Object.entries(sources)) {
    if (name === 'CBSL' || name === 'Market') continue;
    const r = rates[currency];
    if (!r) continue;
    if (r.buy !== null && r.buy > bestBuyRate) { bestBuyRate = r.buy; bestBuy = { name, rate: r.buy }; }
    if (r.sell !== null && r.sell < bestSellRate) { bestSellRate = r.sell; bestSell = { name, rate: r.sell }; }
  }

  if (!bestBuy && !bestSell) {
    return (
      <div className="text-sm text-muted-foreground p-4">No rates available for {currency}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <SummaryCard
        dotClass="text-green-500"
        label="Best Buy Rate"
        info={bestBuy}
        currency={currency}
      />
      <SummaryCard
        dotClass="text-blue-500"
        label="Best Sell Rate"
        info={bestSell}
        currency={currency}
      />
    </div>
  );
}

function SummaryCard({ dotClass, label, info, currency }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-3">
        <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
          <span aria-hidden="true" className={dotClass}>●</span>
          {label}
        </div>
        {info ? (
          <>
            <div className="text-xl font-bold text-foreground">{info.rate.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{info.name} · LKR/{currency}</div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">—</div>
        )}
      </CardContent>
    </Card>
  );
}
