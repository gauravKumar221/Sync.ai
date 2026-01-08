
'use client';
import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type Event = {
    id: string;
    date: Date;
}

export const InteractiveCalendar = ({ onDateSelect, onGoToToday, events, selectedDate }: { onDateSelect: (date: Date) => void, onGoToToday: () => void, events: Event[], selectedDate: Date }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [direction, setDirection] = useState(0);

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 py-4">
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <div className="flex items-center gap-2">
         <Button variant="outline" size="sm" onClick={onGoToToday} className="h-8 bg-white/5 hover:bg-white/10 border-white/10">
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 bg-white/5 hover:bg-white/10 border-white/10">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 bg-white/5 hover:bg-white/10 border-white/10">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {days.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const variants = {
      enter: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 10 : -10,
      }),
      center: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
      },
      exit: (direction: number) => ({
        opacity: 0,
        x: direction < 0 ? 10 : -10,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }),
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayHasEvent = events.some(event => isSameDay(event.date, cloneDay));
        
        days.push(
          <div
            className={cn(
              'relative h-20 md:h-24 p-2 cursor-pointer transition-colors duration-200 glass-card',
              !isSameMonth(day, monthStart) && 'text-muted-foreground/50 bg-white/5',
              isSameDay(day, selectedDate) 
                ? 'bg-primary/20 ring-2 ring-primary' 
                : 'hover:bg-primary/10',
              isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && 'bg-blue-500/20',
            )}
            key={day.toString()}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span className={cn(
              "absolute top-2 left-2 text-sm font-medium",
               isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && 'text-blue-300'
            )}>
              {format(day, 'd')}
            </span>
             {dayHasEvent && (
              <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-orange-400"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7 gap-2">{days}</div>);
      days = [];
    }

    return (
        <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={currentMonth.toString()}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-2"
            >
                {rows}
            </motion.div>
        </AnimatePresence>
    );
  };


  return (
    <div className="w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
