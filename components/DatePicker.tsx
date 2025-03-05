'use client';

import { useState, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({
  label,
  selectedDate,
  onChange,
  minDate = new Date(),
  placeholder = 'Select date',
  className = '',
}: DatePickerProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Custom input component
  const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        className={`flex items-center glass-effect rounded-lg px-4 py-3 cursor-pointer ${
          isFocused ? 'ring-2 ring-primary/50' : ''
        }`}
        onClick={onClick}
        ref={ref}
      >
        <div className="flex-1 truncate">
          {value || placeholder}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2 text-white/70"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  );

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        minDate={minDate}
        dateFormat="MMMM d, yyyy"
        customInput={<CustomInput />}
        onCalendarOpen={() => setIsFocused(true)}
        onCalendarClose={() => setIsFocused(false)}
        wrapperClassName="w-full"
        calendarClassName="bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white"
        dayClassName={date => 
          "hover:bg-gray-800 rounded-full w-8 h-8 mx-auto flex items-center justify-center"
        }
        popperClassName="z-50"
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              tether: false,
              altAxis: true,
            },
          },
        ]}
      />
      <style jsx global>{`
        .react-datepicker {
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: #111827 !important;
          border-bottom-color: #374151 !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker-time__header {
          color: white !important;
        }
        .react-datepicker__day {
          color: #d1d5db !important;
        }
        .react-datepicker__day:hover {
          background-color: #374151 !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: linear-gradient(to right, #8b5cf6, #6366f1) !important;
          color: white !important;
        }
        .react-datepicker__day--disabled {
          color: #6b7280 !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #d1d5db !important;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: white !important;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  );
} 