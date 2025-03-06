'use client';

import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface DatePickerProps {
  label: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  darkMode?: boolean;
}

export default function DatePicker({
  label,
  selectedDate,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className = '',
  darkMode = true
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic classes based on dark/light mode
  const labelClass = darkMode ? "text-white/70" : "text-gray-700";
  const inputBgClass = darkMode ? "glass-effect" : "bg-white border border-gray-300";
  const inputTextClass = darkMode ? "text-white" : "text-gray-800";

  return (
    <div className={`relative ${className}`}>
      <label className={`block text-sm ${labelClass} mb-1`}>{label}</label>
      
      <div className={`${inputBgClass} rounded-lg px-4 py-3 cursor-pointer`}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          onCalendarOpen={() => setIsOpen(true)}
          onCalendarClose={() => setIsOpen(false)}
          className={`w-full bg-transparent outline-none cursor-pointer w-full ${inputTextClass}`}
          calendarClassName={darkMode ? "dark-calendar" : ""}
          dateFormat="MMMM d, yyyy"
        />
        
        <style jsx global>{`
          .react-datepicker {
            font-family: inherit;
            border-radius: 0.5rem;
            border: 1px solid ${darkMode ? '#4B5563' : '#E5E7EB'};
            background-color: ${darkMode ? '#1F2937' : '#FFFFFF'};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
            
          .react-datepicker input{
            width: 100%;
          }
          .react-datepicker-wrapper{
            width: 100%;
          }
          .react-datepicker__header {
            background-color: ${darkMode ? '#374151' : '#F3F4F6'};
            border-bottom: 1px solid ${darkMode ? '#4B5563' : '#E5E7EB'};
          }
          
          .react-datepicker__current-month,
          .react-datepicker__day-name {
            color: ${darkMode ? '#E5E7EB' : '#374151'};
          }
          
          .react-datepicker__day {
            color: ${darkMode ? '#D1D5DB' : '#1F2937'};
          }
          
          .react-datepicker__day:hover {
            background-color: ${darkMode ? '#4B5563' : '#F3F4F6'};
          }
          
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            background-color: var(--color-primary);
            color: white;
          }
          
          .react-datepicker__day--disabled {
            color: ${darkMode ? '#6B7280' : '#9CA3AF'};
          }
          
          .react-datepicker__triangle {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
} 