import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CURRENCIES = [
  'USD', 'GBP', 'EUR', 'AED', 'SAR', 'INR',
  'SGD', 'CAD', 'AUD', 'JPY', 'CNY', 'MYR',
];

function hasData(currency, sources) {
  if (!sources) return false;
  return Object.values(sources).some((src) => {
    const r = src[currency];
    return r && (r.buy !== null || r.sell !== null || r.mid !== null);
  });
}

/**
 * @param {{ selected: string, sources: object|null, onChange: (code: string) => void }} props
 */
export function CurrencySelector({ selected, sources, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b bg-muted/30">
      {CURRENCIES.map((code) => {
        const active = selected === code;
        const available = hasData(code, sources);

        return (
          <Button
            key={code}
            size="sm"
            variant={active ? 'outline' : 'ghost'}
            onClick={() => onChange(code)}
            className={cn(
              'h-7 px-3 text-xs rounded-full',
              active && 'ring-2 ring-primary',
              !available && 'opacity-50'
            )}
            title={!available ? 'No data available for this currency' : undefined}
          >
            {code}
          </Button>
        );
      })}
    </div>
  );
}

