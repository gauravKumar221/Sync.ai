// File: components/calendar/CustomDatePicker.tsx
"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getMonth,
  getYear,
  getWeek,
  parse,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DateRange = {
  from?: Date;
  to?: Date;
};

type CustomDatePickerProps = {
  // Single date mode
  date?: Date;
  // Range mode
  dateRange?: DateRange;
  onSelect?: (date: Date | undefined) => void;
  onSelectRange?: (range: DateRange | undefined) => void;
  mode?: "single" | "range";
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  showWeekNumbers?: boolean;
  // For inline display (not popover)
  inline?: boolean;
};

export function CustomDatePicker({
  date,
  dateRange,
  onSelect,
  onSelectRange,
  mode = "single",
  className,
  placeholder = "Select date",
  disabled = false,
  showWeekNumbers = true,
  inline = false,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [rangeStart, setRangeStart] = useState<Date | undefined>(
    dateRange?.from
  );
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(dateRange?.to);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [manualDateInput, setManualDateInput] = useState("");

  // Month names for dropdown
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Years for dropdown (last 10 years to next 10 years)
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Initialize with props
  useEffect(() => {
    if (date) setSelectedDate(date);
    if (dateRange?.from) setRangeStart(dateRange.from);
    if (dateRange?.to) setRangeEnd(dateRange.to);
  }, [date, dateRange]);

  // Navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (mode === "single") {
      handleDateSelect(today);
    }
  };

  // Handle date selection
  // Handle date selection
  const handleDateSelect = (day: Date) => {
    if (mode === "single") {
      setSelectedDate(day);
      onSelect?.(day);
      if (!inline) setIsOpen(false);
    } else {
      // Range selection
      if (!rangeStart || (rangeStart && rangeEnd) || isSelectingRange) {
        // Start new range
        setRangeStart(day);
        setRangeEnd(undefined);
        setIsSelectingRange(true);
        // Call onSelectRange with start date only
        onSelectRange?.({ from: day, to: undefined });
      } else {
        // Complete range
        const sortedStart = day < rangeStart ? day : rangeStart;
        const sortedEnd = day > rangeStart ? day : rangeStart;
        setRangeStart(sortedStart);
        setRangeEnd(sortedEnd);
        setIsSelectingRange(false);
        onSelectRange?.({ from: sortedStart, to: sortedEnd });
        if (!inline) setIsOpen(false);
      }
    }
  };

  // Clear selection
  // Clear selection
  const clearSelection = () => {
    setSelectedDate(undefined);
    setRangeStart(undefined);
    setRangeEnd(undefined);
    setIsSelectingRange(false); // Add this line
    if (mode === "single") {
      onSelect?.(undefined);
    } else {
      onSelectRange?.(undefined);
    }
  };

  // Manual date input
  // Manual date input
  const handleManualDateSubmit = () => {
    try {
      const parsedDate = parse(manualDateInput, "dd/MM/yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        if (mode === "single") {
          handleDateSelect(parsedDate);
        } else {
          // For range mode, set as start
          setRangeStart(parsedDate);
          setRangeEnd(undefined);
          setIsSelectingRange(true);
          // ADD THIS LINE HERE TOO:
          onSelectRange?.({ from: parsedDate, to: undefined });
        }
        setManualDateInput("");
      }
    } catch (error) {
      console.error("Invalid date format");
    }
  };

  // Month/Year dropdown changes
  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(getYear(currentMonth), monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, getMonth(currentMonth), 1));
  };

  // Format display text
  const getDisplayText = () => {
    if (mode === "range") {
      if (rangeStart && rangeEnd) {
        return `${format(rangeStart, "dd/MM/yyyy")} - ${format(
          rangeEnd,
          "dd/MM/yyyy"
        )}`;
      } else if (rangeStart) {
        return format(rangeStart, "dd/MM/yyyy");
      }
      return placeholder;
    } else {
      return selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder;
    }
  };

  // Render calendar grid
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let weekNumber = getWeek(startDate);

    // Day headers
    const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    while (day <= endDate) {
      // Add week number column
      if (showWeekNumbers) {
        days.push(
          <div
            key={`week-${weekNumber}`}
            className="flex items-center justify-center p-2 text-xs text-muted-foreground border-r"
          >
            {weekNumber}
          </div>
        );
      }

      // Add day cells
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected =
          mode === "single"
            ? selectedDate && isSameDay(cloneDay, selectedDate)
            : (rangeStart && isSameDay(cloneDay, rangeStart)) ||
              (rangeEnd && isSameDay(cloneDay, rangeEnd));

        const isInRange =
          mode === "range" &&
          rangeStart &&
          rangeEnd &&
          cloneDay >= rangeStart &&
          cloneDay <= rangeEnd;

        const isToday = isSameDay(cloneDay, new Date());
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isWeekend = i === 0 || i === 6;

        days.push(
          <button
            key={cloneDay.toString()}
            type="button"
            onClick={() => handleDateSelect(cloneDay)}
            className={cn(
              "relative flex items-center justify-center p-2 h-10 w-10 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              !isCurrentMonth && "text-muted-foreground/50",
              isSelected && "bg-primary text-primary-foreground",
              isInRange && !isSelected && "bg-primary/20",
              isToday && !isSelected && "border-2 border-primary",
              isWeekend && !isSelected && !isToday && "text-muted-foreground"
            )}
          >
            <span className={cn("relative z-10", isSelected && "font-bold")}>
              {format(cloneDay, "d")}
            </span>
          </button>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div
          key={day.toString()}
          className={cn(
            "grid gap-1",
            showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
          )}
        >
          {days}
        </div>
      );
      days = [];
      weekNumber = getWeek(day);
    }

    return (
      <div className="space-y-2">
        {/* Day Headers */}
        <div
          className={cn(
            "grid gap-1 text-center text-xs text-muted-foreground",
            showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
          )}
        >
          {showWeekNumbers && <div className="p-2">WK</div>}
          {dayHeaders.map((header) => (
            <div key={header} className="p-2 font-medium">
              {header}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">{rows}</div>
      </div>
    );
  };

  // Main render for inline or popover
  const renderDatePickerContent = () => (
    <div className="p-4 space-y-4 min-w-[300px]">
      {/* Header with Month/Year selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={getMonth(currentMonth).toString()}
            onValueChange={(value) => handleMonthChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getYear(currentMonth).toString()}
            onValueChange={(value) => handleYearChange(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      {renderCalendar()}

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            disabled={mode === "single" ? !selectedDate : !rangeStart}
          >
            Clear
          </Button>
        </div>

        {mode === "range" && rangeStart && !rangeEnd && (
          <div className="text-sm text-muted-foreground">Select end date</div>
        )}
      </div>

      {/* Manual Date Input */}
      <div className="pt-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="DD/MM/YYYY"
            value={manualDateInput}
            onChange={(e) => setManualDateInput(e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleManualDateSubmit}
            disabled={!manualDateInput}
          >
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter date in DD/MM/YYYY format
        </p>
      </div>
    </div>
  );

  // If inline mode, just render the calendar
  if (inline) {
    return (
      <div className={cn("border rounded-lg", className)}>
        {renderDatePickerContent()}
      </div>
    );
  }

  // Popover mode (default)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            className,
            !selectedDate && !rangeStart && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {renderDatePickerContent()}
      </PopoverContent>
    </Popover>
  );
}
