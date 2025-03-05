'use client';

import { useState, useRef, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
  continent: string;
}

interface CountrySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Common countries data
const countries: Country[] = [
  // North America
  { code: 'US', name: 'United States', continent: 'North America' },
  { code: 'CA', name: 'Canada', continent: 'North America' },
  { code: 'MX', name: 'Mexico', continent: 'North America' },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', continent: 'Europe' },
  { code: 'FR', name: 'France', continent: 'Europe' },
  { code: 'DE', name: 'Germany', continent: 'Europe' },
  { code: 'IT', name: 'Italy', continent: 'Europe' },
  { code: 'ES', name: 'Spain', continent: 'Europe' },
  { code: 'NL', name: 'Netherlands', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', continent: 'Europe' },
  { code: 'NO', name: 'Norway', continent: 'Europe' },
  
  // Asia
  { code: 'JP', name: 'Japan', continent: 'Asia' },
  { code: 'CN', name: 'China', continent: 'Asia' },
  { code: 'IN', name: 'India', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', continent: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', continent: 'Asia' },
  
  // Oceania
  { code: 'AU', name: 'Australia', continent: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', continent: 'Oceania' },
  
  // South America
  { code: 'BR', name: 'Brazil', continent: 'South America' },
  { code: 'AR', name: 'Argentina', continent: 'South America' },
  { code: 'CL', name: 'Chile', continent: 'South America' },
  
  // Africa
  { code: 'ZA', name: 'South Africa', continent: 'Africa' },
  { code: 'EG', name: 'Egypt', continent: 'Africa' },
  { code: 'MA', name: 'Morocco', continent: 'Africa' },
];

export default function CountrySelector({
  label,
  value,
  onChange,
  placeholder = 'Select country',
  className = '',
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search term
  useEffect(() => {
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.continent.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm]);

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
    const country = countries.find(c => c.code === value);
    return country ? country.name : value;
  };

  // Handle selection
  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Group countries by continent
  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = [];
    }
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

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
          {searchTerm && filteredCountries.length === 0 ? (
            <div className="px-4 py-3 text-gray-400">No countries found</div>
          ) : (
            Object.entries(groupedCountries).map(([continent, countries]) => (
              <div key={continent}>
                <div className="px-4 py-2 text-xs text-gray-400 bg-gray-800/50 sticky top-0">
                  {continent}
                </div>
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                      country.code === value ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => handleSelect(country.code)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{country.name}</span>
                      {country.code === value && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 