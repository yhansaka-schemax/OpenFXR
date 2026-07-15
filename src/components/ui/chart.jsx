// shadcn/ui chart primitives — manually implemented (v0.x compatible)
// Based on: https://ui.shadcn.com/charts
import * as React from 'react';
import { Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

// ─── ChartStyle ─────────────────────────────────────────────────────────────
// Injects per-chart CSS variable overrides into a <style> tag scoped by id.
export function ChartStyle({ id, config }) {
  const cssVars = Object.entries(config)
    .filter(([, cfg]) => cfg.color)
    .map(([key, cfg]) => `--color-${key}: ${cfg.color};`)
    .join(' ');

  if (!cssVars) return null;

  return (
    <style>{`[data-chart="${id}"] { ${cssVars} }`}</style>
  );
}

// ─── ChartContext ────────────────────────────────────────────────────────────
const ChartContext = React.createContext(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error('useChart must be used inside <ChartContainer>');
  return ctx;
}

// ─── ChartContainer ──────────────────────────────────────────────────────────
export const ChartContainer = React.forwardRef(
  ({ id, config, children, className, ...props }, ref) => {
    const chartId = id ?? React.useId().replace(/:/g, '');
    return (
      <ChartContext.Provider value={{ config, chartId }}>
        <ChartStyle id={chartId} config={config} />
        <div
          ref={ref}
          data-chart={chartId}
          className={cn('flex aspect-video justify-center text-xs', className)}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';

// ─── ChartTooltip ─────────────────────────────────────────────────────────────
export const ChartTooltip = Tooltip;

// ─── ChartTooltipContent ─────────────────────────────────────────────────────
export const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      label,
      className,
      formatter,
      labelFormatter,
      hideLabel = false,
      hideIndicator = false,
      indicator = 'dot',
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
      >
        {!hideLabel && (
          <p className="font-medium text-foreground">
            {labelFormatter ? labelFormatter(label) : label}
          </p>
        )}
        <div className="grid gap-1">
          {payload.map((item, i) => {
            const key = item.dataKey;
            const cfg = config[key] ?? {};
            const color = `var(--color-${key})`;
            const value = formatter
              ? formatter(item.value, item.name)
              : item.value != null
              ? Number(item.value).toFixed(2)
              : 'N/A';

            return (
              <div key={i} className="flex items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5">
                {!hideIndicator && (
                  <span
                    aria-hidden="true"
                    className="shrink-0"
                    style={{ color }}
                  >
                    ●
                  </span>
                )}
                <span className="text-muted-foreground">{cfg.label ?? item.name}</span>
                <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

// ─── ChartLegend ──────────────────────────────────────────────────────────────
export const ChartLegend = Legend;

// ─── ChartLegendContent ──────────────────────────────────────────────────────
export const ChartLegendContent = React.forwardRef(
  ({ className, payload, onClick }, ref) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center justify-center gap-3 pt-2 text-xs', className)}
      >
        {payload.map((item) => {
          const key = item.dataKey ?? item.value;
          const cfg = config[key] ?? {};
          const color = `var(--color-${key})`;
          const inactive = item.inactive ?? false;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onClick?.(item)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 transition-opacity',
                inactive && 'opacity-40'
              )}
            >
              <span aria-hidden="true" style={{ color }}>●</span>
              <span className="text-muted-foreground">{cfg.label ?? item.value}</span>
            </button>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegendContent';
