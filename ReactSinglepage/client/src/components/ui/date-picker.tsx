import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}

const monthNames = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

export function DatePicker({
  selected,
  onSelect,
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [month, setMonth] = React.useState<Date>(
    selected || new Date()
  );

  // Update month state when selected date changes
  React.useEffect(() => {
    if (selected) {
      setMonth(selected);
    }
  }, [selected]);

  const currentYear = month.getFullYear();
  const currentMonth = month.getMonth();

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).reverse();
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth, 1);
    setMonth(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentYear, parseInt(monthIndex), 1);
    setMonth(newDate);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      onSelect?.(date);
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Year and Month Selectors - Clean Layout */}
      <div className="flex items-center justify-center gap-2">
        <Select
          value={currentYear.toString()}
          onValueChange={handleYearChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentMonth.toString()}
          onValueChange={handleMonthChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {months.map((monthIdx) => (
              <SelectItem key={monthIdx} value={monthIdx.toString()}>
                {monthNames[monthIdx]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleDaySelect}
        locale={vi}
        month={month}
        onMonthChange={setMonth}
        disabled={(date) => {
          // Disable if general disabled prop is true
          if (disabled) return true;
          // Disable dates in the future
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          return dateToCompare > today;
        }}
        classNames={{
          months: "flex flex-col",
          month: "space-y-3",
          caption: "hidden",
          caption_label: "hidden",
          nav: "hidden",
          nav_button: "hidden",
          nav_button_previous: "hidden",
          nav_button_next: "hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
}

