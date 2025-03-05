'use client';

import { useState, useRef, useEffect } from 'react';

interface State {
  code: string;
  name: string;
  countryCode: string;
}

interface StateSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  placeholder?: string;
  className?: string;
}

// Common states data
const states: State[] = [
  // United States
  { code: 'AL', name: 'Alabama', countryCode: 'US' },
  { code: 'AK', name: 'Alaska', countryCode: 'US' },
  { code: 'AZ', name: 'Arizona', countryCode: 'US' },
  { code: 'AR', name: 'Arkansas', countryCode: 'US' },
  { code: 'CA', name: 'California', countryCode: 'US' },
  { code: 'CO', name: 'Colorado', countryCode: 'US' },
  { code: 'CT', name: 'Connecticut', countryCode: 'US' },
  { code: 'DE', name: 'Delaware', countryCode: 'US' },
  { code: 'FL', name: 'Florida', countryCode: 'US' },
  { code: 'GA', name: 'Georgia', countryCode: 'US' },
  { code: 'HI', name: 'Hawaii', countryCode: 'US' },
  { code: 'ID', name: 'Idaho', countryCode: 'US' },
  { code: 'IL', name: 'Illinois', countryCode: 'US' },
  { code: 'IN', name: 'Indiana', countryCode: 'US' },
  { code: 'IA', name: 'Iowa', countryCode: 'US' },
  { code: 'KS', name: 'Kansas', countryCode: 'US' },
  { code: 'KY', name: 'Kentucky', countryCode: 'US' },
  { code: 'LA', name: 'Louisiana', countryCode: 'US' },
  { code: 'ME', name: 'Maine', countryCode: 'US' },
  { code: 'MD', name: 'Maryland', countryCode: 'US' },
  { code: 'MA', name: 'Massachusetts', countryCode: 'US' },
  { code: 'MI', name: 'Michigan', countryCode: 'US' },
  { code: 'MN', name: 'Minnesota', countryCode: 'US' },
  { code: 'MS', name: 'Mississippi', countryCode: 'US' },
  { code: 'MO', name: 'Missouri', countryCode: 'US' },
  { code: 'MT', name: 'Montana', countryCode: 'US' },
  { code: 'NE', name: 'Nebraska', countryCode: 'US' },
  { code: 'NV', name: 'Nevada', countryCode: 'US' },
  { code: 'NH', name: 'New Hampshire', countryCode: 'US' },
  { code: 'NJ', name: 'New Jersey', countryCode: 'US' },
  { code: 'NM', name: 'New Mexico', countryCode: 'US' },
  { code: 'NY', name: 'New York', countryCode: 'US' },
  { code: 'NC', name: 'North Carolina', countryCode: 'US' },
  { code: 'ND', name: 'North Dakota', countryCode: 'US' },
  { code: 'OH', name: 'Ohio', countryCode: 'US' },
  { code: 'OK', name: 'Oklahoma', countryCode: 'US' },
  { code: 'OR', name: 'Oregon', countryCode: 'US' },
  { code: 'PA', name: 'Pennsylvania', countryCode: 'US' },
  { code: 'RI', name: 'Rhode Island', countryCode: 'US' },
  { code: 'SC', name: 'South Carolina', countryCode: 'US' },
  { code: 'SD', name: 'South Dakota', countryCode: 'US' },
  { code: 'TN', name: 'Tennessee', countryCode: 'US' },
  { code: 'TX', name: 'Texas', countryCode: 'US' },
  { code: 'UT', name: 'Utah', countryCode: 'US' },
  { code: 'VT', name: 'Vermont', countryCode: 'US' },
  { code: 'VA', name: 'Virginia', countryCode: 'US' },
  { code: 'WA', name: 'Washington', countryCode: 'US' },
  { code: 'WV', name: 'West Virginia', countryCode: 'US' },
  { code: 'WI', name: 'Wisconsin', countryCode: 'US' },
  { code: 'WY', name: 'Wyoming', countryCode: 'US' },
  
  // Canada
  { code: 'AB', name: 'Alberta', countryCode: 'CA' },
  { code: 'BC', name: 'British Columbia', countryCode: 'CA' },
  { code: 'MB', name: 'Manitoba', countryCode: 'CA' },
  { code: 'NB', name: 'New Brunswick', countryCode: 'CA' },
  { code: 'NL', name: 'Newfoundland and Labrador', countryCode: 'CA' },
  { code: 'NS', name: 'Nova Scotia', countryCode: 'CA' },
  { code: 'ON', name: 'Ontario', countryCode: 'CA' },
  { code: 'PE', name: 'Prince Edward Island', countryCode: 'CA' },
  { code: 'QC', name: 'Quebec', countryCode: 'CA' },
  { code: 'SK', name: 'Saskatchewan', countryCode: 'CA' },
  
  // Australia
  { code: 'ACT', name: 'Australian Capital Territory', countryCode: 'AU' },
  { code: 'NSW', name: 'New South Wales', countryCode: 'AU' },
  { code: 'NT', name: 'Northern Territory', countryCode: 'AU' },
  { code: 'QLD', name: 'Queensland', countryCode: 'AU' },
  { code: 'SA', name: 'South Australia', countryCode: 'AU' },
  { code: 'TAS', name: 'Tasmania', countryCode: 'AU' },
  { code: 'VIC', name: 'Victoria', countryCode: 'AU' },
  { code: 'WA', name: 'Western Australia', countryCode: 'AU' },
];

export default function StateSelector({
  label,
  value,
  onChange,
  countryCode,
  placeholder = 'Select state/province',
  className = '',
}: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update available states when country changes
  useEffect(() => {
    const statesForCountry = states.filter(state => state.countryCode === countryCode);
    setAvailableStates(statesForCountry);
    setFilteredStates(statesForCountry);
    
    // Reset value if current value is not valid for new country
    if (value && !statesForCountry.some(state => state.code === value)) {
      onChange('');
    }
  }, [countryCode, onChange, value]);

  // Filter states based on search term
  useEffect(() => {
    const filtered = availableStates.filter(state => 
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [searchTerm, availableStates]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get display value
  const getDisplayValue = () => {
    if (!value) return '';
    const state = states.find(s => s.code === value && s.countryCode === countryCode);
    return state ? state.name : value;
  };

  // Handle selection
  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  // If no country is selected or country has no states
  if (!countryCode || availableStates.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm text-white/70 mb-1">{label}</label>
        <div className="flex items-center glass-effect rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed">
          <div className="flex-1 truncate">
            {!countryCode ? 'Select a country first' : 'No states/provinces available'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      
      <div 
        className="flex items-center glass-effect rounded-lg px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div className="flex-1 truncate">
            {getDisplayValue() || placeholder}
          </div>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
          style={{ top: '100%' }}
        >
          {filteredStates.length === 0 ? (
            <div className="px-4 py-3 text-gray-400">No states/provinces found</div>
          ) : (
            filteredStates.map((state) => (
              <div
                key={state.code}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                  state.code === value ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleSelect(state.code)}
              >
                <div className="flex items-center justify-between">
                  <span>{state.name}</span>
                  {state.code === value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 