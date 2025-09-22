import React from 'react';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const countries = [
  { code: 'PY', name: 'PYG (Paraguay)' },
  { code: 'US', name: 'USD (EEUU)' },
  { code: 'ES', name: 'EUR (España)' },
  { code: 'PE', name: 'PEN (Peru)' },
  { code: 'BO', name: 'BOB (Bolivia)' },
  { code: 'CL', name: 'CLP (Chile)' },
];

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange, className, style }) => {
  return (
    <select
      value={selectedCountry}
      onChange={(e) => onCountryChange(e.target.value)}
      className={className}
      style={style}
    >
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
