
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

interface CalendarProps {
  bookings: Booking[];
  villaId: string | null;
  onRangeSelect: (start: Date | null, end: Date | null) => void;
  selectedStart: Date | null;
  selectedEnd: Date | null;
}

export const BookingCalendar: React.FC<CalendarProps> = ({ bookings, villaId, onRangeSelect, selectedStart, selectedEnd }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to check if a date is booked
  const isDateBooked = (date: Date) => {
    if (!villaId) return false;
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(b => {
      if (b.villaId !== villaId || b.status === BookingStatus.CANCELLED) return false;
      return dateStr >= b.startDate && dateStr <= b.endDate;
    });
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStart) return false;
    if (selectedEnd) {
      return date >= selectedStart && date <= selectedEnd;
    }
    return date.getTime() === selectedStart.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      onRangeSelect(date, null);
    } else {
      // Validating range does not include booked dates
      const start = selectedStart < date ? selectedStart : date;
      const end = selectedStart < date ? date : selectedStart;
      
      let isValidRange = true;
      let curr = new Date(start);
      while (curr <= end) {
        if (isDateBooked(curr)) {
          isValidRange = false;
          break;
        }
        curr.setDate(curr.getDate() + 1);
      }

      if (isValidRange) {
        onRangeSelect(start, end);
      } else {
        onRangeSelect(date, null); // Reset if invalid range
      }
    }
  };

  const renderMonth = (offset: number) => {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    // Adjust for Monday start
    const startDay = firstDay === 0 ? 6 : firstDay - 1; 

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-full"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const booked = isDateBooked(date);
      const selected = isDateSelected(date);
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      days.push(
        <button
          key={date.toISOString()}
          disabled={booked || isPast}
          onClick={() => handleDateClick(date)}
          className={`h-10 w-full flex items-center justify-center text-sm rounded-sm transition relative
            ${booked || isPast ? 'text-slate-300 cursor-not-allowed decoration-slate-300' : 'text-slate-700 hover:bg-stone-100 font-medium'}
            ${booked ? 'bg-stone-50 diagonal-strike' : ''}
            ${selected ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md z-10' : ''}
            ${selectedStart && selectedEnd && date > selectedStart && date < selectedEnd ? 'bg-slate-100' : ''}
          `}
        >
          {i}
          {booked && !isPast && <span className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></span>}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="text-center font-serif font-bold text-slate-900 mb-4 capitalize">
          {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-[10px] font-bold uppercase text-slate-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-sm border border-stone-200 shadow-sm overflow-hidden select-none">
      <div className="flex justify-between items-center p-2 bg-stone-50 border-b border-stone-100">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white rounded-full transition"><ChevronLeft size={16}/></button>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Availability & Rates</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white rounded-full transition"><ChevronRight size={16}/></button>
      </div>
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-100">
        <div className="flex-1">{renderMonth(0)}</div>
        <div className="flex-1 hidden md:block">{renderMonth(1)}</div>
      </div>
      {!villaId && (
        <div className="bg-amber-50 p-3 text-center text-xs text-amber-800 border-t border-amber-100">
          Please select a villa to view real-time availability.
        </div>
      )}
      {villaId && (
        <div className="bg-stone-50 p-3 flex justify-center space-x-6 text-xs border-t border-stone-200">
            <div className="flex items-center"><div className="w-3 h-3 bg-white border border-stone-300 rounded-sm mr-2"></div> Available</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-slate-900 rounded-sm mr-2"></div> Selected</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-stone-100 border border-stone-200 rounded-sm mr-2 relative diagonal-strike"></div> Booked</div>
        </div>
      )}
      <style>{`
        .diagonal-strike {
          background-image: linear-gradient(45deg, transparent 48%, #e5e7eb 48%, #e5e7eb 52%, transparent 52%);
        }
      `}</style>
    </div>
  );
};
