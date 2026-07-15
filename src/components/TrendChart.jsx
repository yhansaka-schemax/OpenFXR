import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartConfig = {
  CBSL:       { label: 'CBSL (official)',  color: 'hsl(var(--color-cbsl))' },
  Market:     { label: 'Market (API)',     color: 'hsl(var(--color-market))' },
  BOC:        { label: 'BOC',              color: 'hsl(var(--color-boc))' },
  "People's": { label: "People's Bank",   color: 'hsl(var(--color-peoples))' },
  Commercial: { label: 'Commercial',       color: 'hsl(var(--color-commercial))' },
  HNB:        { label: 'HNB',             color: 'hsl(var(--color-hnb))' },
  Sampath:    { label: 'Sampath',          color: 'hsl(var(--color-sampath))' },
};

/**
 * @param {{ currency: string, history: object[]|null, loading: boolean }} props
 */
export function TrendChart({ currency, history, loading }) {
  const [hiddenSources, setHiddenSources] = useState(new Set());

  const { chartData, sourceNames } = useMemo(() => {
    if (!history || history.length === 0) return { chartData: [], sourceNames: [] };

    const names = new Set();
    const data = history.map((snapshot) => {
      const point = { date: snapshot.updated.slice(0, 10) };
      for (const [name, rates] of Object.entries(snapshot.sources ?? {})) {
        names.add(name);
        const r = rates[currency];
        const val = name === 'CBSL' || name === 'Market' ? (r?.mid ?? null) : (r?.buy ?? null);
        point[name] = val;
      }
      return point;
    });

    return { chartData: data, sourceNames: [...names] };
  }, [history, currency]);

  const handleLegendClick = (item) => {
    const key = item.dataKey ?? item.value;
    setHiddenSources((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const payloadWithInactive = sourceNames.map((name) => ({
    value: name,
    dataKey: name,
    inactive: hiddenSources.has(name),
  }));

  if (loading) {
    return (
      <Card className="m-4 border-0 shadow-none">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const uniqueDays = new Set(chartData.map((d) => d.date)).size;
  if (uniqueDays < 3) {
    return (
      <Card className="m-4 border-dashed">
        <CardContent className="p-8 text-center">
          <p className="text-4xl mb-3">📈</p>
          <p className="font-medium text-foreground">Not enough history yet</p>
          <p className="text-sm text-muted-foreground mt-1">Charts appear after 3 days of data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4 border-0 shadow-none">
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="w-full h-[320px]">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.slice(5)}
              stroke="hsl(var(--border))"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(0)}
              domain={['auto', 'auto']}
              stroke="hsl(var(--border))"
              tickLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Date: ${label}`}
                />
              }
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  payload={payloadWithInactive}
                  onClick={handleLegendClick}
                />
              }
            />
            {sourceNames.map((name) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={`var(--color-${name === "People's" ? 'peoples' : name.toLowerCase()})`}
                strokeWidth={name === 'CBSL' ? 1.5 : 2}
                strokeDasharray={name === 'CBSL' ? '5 4' : undefined}
                dot={false}
                hide={hiddenSources.has(name)}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
