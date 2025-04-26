'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';

// Directly using the type from actions - ensure it's exported if not already
import { TimecardFilter } from '@/lib/actions/timecards';

interface TimecardFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  initialFilters?: Partial<TimecardFilter>;
  onFiltersChange: (filters: Partial<TimecardFilter>) => void;
}

export function TimecardFilters({
  className,
  initialFilters,
  onFiltersChange,
}: TimecardFiltersProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    // Set initial date range, e.g., last 30 days
    const start = initialFilters?.dateRange?.from || addDays(new Date(), -30);
    const end = initialFilters?.dateRange?.to || new Date();
    return { from: start, to: end };
  });

  // --- Effects --- (Optional: Trigger initial filter application)
  // React.useEffect(() => {
  //   onFiltersChange({ dateRange: date });
  // }, []); // Run only once on mount

  // --- Handlers ---
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onFiltersChange({ dateRange: newDate });
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full md:w-[300px] justify-start text-left font-normal bg-white border rounded-md shadow-sm', // Style matching dashboard
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {/* Placeholder for Project Filter - requires different implementation now */}
      {/* <Select> ... </Select> */}
    </div>
  );
} 