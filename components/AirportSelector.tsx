'use client';

import { useState, useEffect, useRef } from 'react';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  state?: string;
  countryCode: string;
  stateCode?: string;
  cityCode?: boolean;
}

interface AirportSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  excludeCode?: string;
  darkMode?: boolean;
}

// Enhanced airports data with city codes for major cities
const airports: Airport[] = [
  // City codes for major US cities
  { code: 'NYC', name: 'All New York Airports', city: 'New York', country: 'USA', state: 'New York', countryCode: 'US', stateCode: 'NY', cityCode: true },
  { code: 'CHI', name: 'All Chicago Airports', city: 'Chicago', country: 'USA', state: 'Illinois', countryCode: 'US', stateCode: 'IL', cityCode: true },
  { code: 'WAS', name: 'All Washington DC Airports', city: 'Washington DC', country: 'USA', state: 'District of Columbia', countryCode: 'US', stateCode: 'DC', cityCode: true },
  { code: 'BOS', name: 'All Boston Airports', city: 'Boston', country: 'USA', state: 'Massachusetts', countryCode: 'US', stateCode: 'MA', cityCode: true },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', state: 'California', countryCode: 'US', stateCode: 'CA' },
  
  // Mexico
  { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'Mexico', countryCode: 'MX' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', countryCode: 'MX' },
  
  // United States
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', state: 'New York', countryCode: 'US', stateCode: 'NY' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA', state: 'New York', countryCode: 'US', stateCode: 'NY' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'USA', state: 'New Jersey', countryCode: 'US', stateCode: 'NJ' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA', state: 'Illinois', countryCode: 'US', stateCode: 'IL' },
  { code: 'MDW', name: 'Chicago Midway International Airport', city: 'Chicago', country: 'USA', state: 'Illinois', countryCode: 'US', stateCode: 'IL' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'USA', state: 'Georgia', countryCode: 'US', stateCode: 'GA' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA', state: 'Texas', countryCode: 'US', stateCode: 'TX' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', state: 'California', countryCode: 'US', stateCode: 'CA' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA', state: 'Florida', countryCode: 'US', stateCode: 'FL' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'USA', state: 'Washington', countryCode: 'US', stateCode: 'WA' },
  { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'USA', state: 'Massachusetts', countryCode: 'US', stateCode: 'MA' },
  { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA', state: 'Nevada', countryCode: 'US', stateCode: 'NV' },
  { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'USA', state: 'Colorado', countryCode: 'US', stateCode: 'CO' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'USA', state: 'Arizona', countryCode: 'US', stateCode: 'AZ' },
  { code: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'USA', state: 'Texas', countryCode: 'US', stateCode: 'TX' },
  { code: 'MSP', name: 'Minneapolis–Saint Paul International Airport', city: 'Minneapolis', country: 'USA', state: 'Minnesota', countryCode: 'US', stateCode: 'MN' },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County Airport', city: 'Detroit', country: 'USA', state: 'Michigan', countryCode: 'US', stateCode: 'MI' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', state: 'Ontario', countryCode: 'CA', stateCode: 'ON' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', state: 'British Columbia', countryCode: 'CA', stateCode: 'BC' },
  { code: 'YUL', name: 'Montréal–Trudeau International Airport', city: 'Montreal', country: 'Canada', state: 'Quebec', countryCode: 'CA', stateCode: 'QC' },
  { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada', state: 'Alberta', countryCode: 'CA', stateCode: 'AB' },
  { code: 'YEG', name: 'Edmonton International Airport', city: 'Edmonton', country: 'Canada', state: 'Alberta', countryCode: 'CA', stateCode: 'AB' },
  
  // United Kingdom
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', countryCode: 'GB' },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB' },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom', countryCode: 'GB' },
  
  // France
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', countryCode: 'FR' },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', countryCode: 'FR' },
  
  // Germany
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', countryCode: 'DE' },
  { code: 'TXL', name: 'Berlin Tegel Airport', city: 'Berlin', country: 'Germany', countryCode: 'DE' },
  
  // Other European
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', countryCode: 'ES' },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', countryCode: 'IT' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', countryCode: 'CH' },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', countryCode: 'SE' },
  { code: 'OSL', name: 'Oslo Airport, Gardermoen', city: 'Oslo', country: 'Norway', countryCode: 'NO' },
  
  // Asia
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', countryCode: 'CN' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', countryCode: 'CN' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', countryCode: 'CN' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', countryCode: 'KR' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', countryCode: 'IN' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', countryCode: 'IN' },
  
  // Australia
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', state: 'New South Wales', countryCode: 'AU', stateCode: 'NSW' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', state: 'Victoria', countryCode: 'AU', stateCode: 'VIC' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', state: 'Queensland', countryCode: 'AU', stateCode: 'QLD' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', state: 'Western Australia', countryCode: 'AU', stateCode: 'WA' },
  { code: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', country: 'Australia', state: 'South Australia', countryCode: 'AU', stateCode: 'SA' },
  
  // New Zealand
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', countryCode: 'NZ' },
  { code: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand', countryCode: 'NZ' },
  { code: 'WLG', name: 'Wellington International Airport', city: 'Wellington', country: 'New Zealand', countryCode: 'NZ' },
  
  // South America
  { code: 'GRU', name: 'São Paulo–Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', countryCode: 'BR' },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR' },
  { code: 'SCL', name: 'Santiago International Airport', city: 'Santiago', country: 'Chile', countryCode: 'CL' },
  
  // Africa
  { code: 'JNB', name: 'O. R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', countryCode: 'ZA' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', countryCode: 'EG' },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', countryCode: 'MA' },
];

export default function AirportSelector({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Select airport', 
  className = '',
  excludeCode,
  darkMode = true
}: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>(airports);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter airports based on search term and excluded code
  useEffect(() => {
    const filtered = airports
      .filter(airport => excludeCode ? airport.code !== excludeCode : true)
      .filter(airport => 
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (airport.state && airport.state.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    setFilteredAirports(filtered);
  }, [searchTerm, excludeCode]);

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
    const airport = airports.find(a => a.code === value);
    return airport ? `${airport.city} (${airport.code})` : value;
  };

  // Handle selection
  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Group airports by country
  const groupedAirports = filteredAirports.reduce((acc, airport) => {
    if (!acc[airport.country]) {
      acc[airport.country] = [];
    }
    acc[airport.country].push(airport);
    return acc;
  }, {} as Record<string, Airport[]>);

  // Dynamic classes based on dark/light mode
  const labelClass = darkMode ? "text-white/70" : "text-gray-700";
  const inputBgClass = darkMode ? "glass-effect" : "bg-white border border-gray-300";
  const inputTextClass = darkMode ? "text-white" : "text-gray-800";
  const dropdownBgClass = darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300";
  const dropdownHeaderClass = darkMode ? "text-gray-400 bg-gray-800/50" : "text-gray-500 bg-gray-100";
  const dropdownItemHoverClass = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const dropdownItemActiveClass = darkMode ? "bg-gray-800" : "bg-gray-100";
  const dropdownTextClass = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className={`block text-sm ${labelClass} mb-1`}>{label}</label>
      
      <div 
        className={`flex items-center ${inputBgClass} rounded-lg px-4 py-3 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <input
            type="text"
            className={`w-full bg-transparent outline-none ${inputTextClass}`}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div className={`flex-1 truncate ${inputTextClass}`}>
            {getDisplayValue() || placeholder}
          </div>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-white' : 'text-gray-500'}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className={`absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto ${dropdownBgClass} border rounded-lg shadow-lg z-50`}
          style={{ top: '100%' }}
        >
          {searchTerm && filteredAirports.length === 0 ? (
            <div className={`px-4 py-3 ${dropdownTextClass}`}>No airports found</div>
          ) : (
            Object.entries(groupedAirports).map(([country, airports]) => (
              <div key={country}>
                <div className={`px-4 py-2 text-xs ${dropdownHeaderClass} sticky top-0`}>
                  {country}
                </div>
                {airports.map((airport) => (
                  <div
                    key={airport.code}
                    className={`px-4 py-3 cursor-pointer ${dropdownItemHoverClass} transition-colors ${
                      airport.code === value ? dropdownItemActiveClass : ''
                    }`}
                    onClick={() => handleSelect(airport.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {airport.city} ({airport.code})
                          {airport.cityCode}
                        </div>
                        <div className={`text-sm ${dropdownTextClass} truncate`}>
                          {airport.name}
                          {airport.state && ` • ${airport.state}`}
                        </div>
                      </div>
                      {airport.code === value && (
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