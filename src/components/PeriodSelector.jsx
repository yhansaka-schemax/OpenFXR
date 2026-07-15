import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/**
 * @param {{
 *   preset: '7d'|'30d'|'custom',
 *   startDate: string,
 *   endDate: string,
 *   onPresetChange: (preset: string) => void,
 *   onCustomRange: (start: string, end: string) => void
 * }} props
 */
export function PeriodSelector({ preset, startDate, endDate, onPresetChange, onCustomRange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState(() =>
    preset === 'custom'
      ? { from: parseISO(startDate), to: parseISO(endDate) }
      : undefined
  );

  function handlePreset(p) {
    setRange(undefined);
    onPresetChange(p);
  }

  function handleRangeSelect(selected) {
    setRange(selected);
    if (selected?.from && selected?.to) {
      onCustomRange(
        format(selected.from, 'yyyy-MM-dd'),
        format(selected.to, 'yyyy-MM-dd')
      );
      setPickerOpen(false);
    }
  }

  const customLabel =
    preset === 'custom' && startDate && endDate
      ? `${startDate} → ${endDate}`
      : 'Custom range';

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b">
      <span className="text-xs text-muted-foreground font-medium mr-1">Period:</span>

      {['7d', '30d'].map((p) => (
        <Button
          key={p}
          size="sm"
          variant="outline"
          onClick={() => handlePreset(p)}
          className={cn(
            'h-7 px-3 text-xs',
            preset === p && 'ring-2 ring-primary'
          )}
        >
          {p}
        </Button>
      ))}

      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'h-7 px-3 text-xs gap-1.5',
              preset === 'custom' && 'ring-2 ring-primary'
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {customLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            disabled={{ after: new Date() }}
            numberOfMonths={2}
            classNames={{
              root: 'p-3',
              months: 'flex gap-4',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium',
              nav: 'space-x-1 flex items-center',
              nav_button: cn(
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded border border-border'
              ),
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'h-9 w-9 text-center text-sm p-0 relative',
              day: cn(
                'h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              ),
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'text-muted-foreground opacity-50',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle: 'bg-accent text-accent-foreground rounded-none',
              day_range_start: 'bg-primary text-primary-foreground rounded-l-md',
              day_range_end: 'bg-primary text-primary-foreground rounded-r-md',
              day_hidden: 'invisible',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
