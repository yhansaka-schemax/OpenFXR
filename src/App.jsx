import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Header } from './components/Header.jsx';
import { CurrencySelector } from './components/CurrencySelector.jsx';
import { BestRateSummary } from './components/BestRateSummary.jsx';
import { RateTable } from './components/RateTable.jsx';
import { TrendChart } from './components/TrendChart.jsx';
import { PeriodSelector } from './components/PeriodSelector.jsx';
import { useLatestRates } from './hooks/useLatestRates.js';
import { useHistory } from './hooks/useHistory.js';
import { useTheme } from './hooks/useTheme.js';
import { usePeriod } from './hooks/usePeriod.js';

const DEFAULT_CURRENCY = 'USD';

function getCurrencyFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('currency') || DEFAULT_CURRENCY;
}

function setCurrencyInURL(currency) {
  const url = new URL(window.location.href);
  url.searchParams.set('currency', currency);
  window.history.replaceState(null, '', url.toString());
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState(getCurrencyFromURL);
  const { data, loading, error, lastUpdated } = useLatestRates();
  const { startDate, endDate, preset, setPreset, setCustomRange } = usePeriod();
  const { history, loading: histLoading, fetchHistory } = useHistory({ startDate, endDate });

  // Re-fetch when period changes while Trends tab is visible
  const [trendsVisible, setTrendsVisible] = useState(false);
  useEffect(() => {
    if (trendsVisible) {
      fetchHistory(startDate, endDate);
    }
  }, [startDate, endDate, trendsVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const sources = data?.sources ?? null;

  function handleCurrencyChange(code) {
    setCurrency(code);
    setCurrencyInURL(code);
  }

  function handleTabChange(value) {
    if (value === 'trends' && !trendsVisible) {
      setTrendsVisible(true);
      fetchHistory(startDate, endDate);
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>Failed to load rates: {error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden">
          <CurrencySelector
            selected={currency}
            sources={sources}
            onChange={handleCurrencyChange}
          />

          <Tabs defaultValue="compare" onValueChange={handleTabChange}>
            <div className="px-4 pt-2 border-b">
              <TabsList className="h-9 bg-transparent p-0 gap-0 rounded-none">
                <TabsTrigger
                  value="compare"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-9"
                >
                  Compare
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-9"
                >
                  Trends
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="compare" className="mt-0">
              <BestRateSummary currency={currency} sources={sources} />
              <RateTable currency={currency} sources={sources} lastUpdated={lastUpdated} />
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              <PeriodSelector
                preset={preset}
                startDate={startDate}
                endDate={endDate}
                onPresetChange={setPreset}
                onCustomRange={setCustomRange}
              />
              <TrendChart currency={currency} history={history} loading={histLoading} />
            </TabsContent>
          </Tabs>
        </Card>

        <footer className="text-center text-xs text-muted-foreground pb-6">
          Data collected from public bank websites and ExchangeRate-API · Not financial advice
        </footer>
      </main>
    </div>
  );
}
