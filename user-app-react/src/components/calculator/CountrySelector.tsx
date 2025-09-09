import React from 'react';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

const countries = [
  { code: 'PY', name: 'Paraguay' },
  { code: 'US', name: 'EEUU' },
  { code: 'ES', name: 'España' },
  { code: 'PE', name: 'Perú' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'CL', name: 'Chile' },
];

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="country-selector" className="block text-sm font-medium text-gray-700 mb-1">
        País de Destino
      </label>
      <select
        id="country-selector"
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;
