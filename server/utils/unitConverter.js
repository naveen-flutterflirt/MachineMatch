/**
 * Generic, Configuration-Driven Unit Converter System
 * Convert physical measurement units to standard canonical units cleanly.
 */

// Unit conversion factors relative to standard base units
const UNIT_CONVERSION_RATES = {
  // Mass / Weight (Standard: kg)
  kg: { baseUnit: 'kg', factor: 1.0 },
  t: { baseUnit: 'kg', factor: 1000.0 },
  ton: { baseUnit: 'kg', factor: 1000.0 },
  tons: { baseUnit: 'kg', factor: 1000.0 },
  tonne: { baseUnit: 'kg', factor: 1000.0 },
  lbs: { baseUnit: 'kg', factor: 0.453592 },
  lb: { baseUnit: 'kg', factor: 0.453592 },

  // Length / Distance (Standard: mm)
  mm: { baseUnit: 'mm', factor: 1.0 },
  m: { baseUnit: 'mm', factor: 1000.0 },
  cm: { baseUnit: 'mm', factor: 10.0 },
  in: { baseUnit: 'mm', factor: 25.4 },
  inch: { baseUnit: 'mm', factor: 25.4 },
  ft: { baseUnit: 'mm', factor: 304.8 },
  feet: { baseUnit: 'mm', factor: 304.8 },

  // Volume (Standard: m3)
  m3: { baseUnit: 'm3', factor: 1.0 },
  'm³': { baseUnit: 'm3', factor: 1.0 },
  cum: { baseUnit: 'm3', factor: 1.0 },
  'cu m': { baseUnit: 'm3', factor: 1.0 },
  'cu yd': { baseUnit: 'm3', factor: 0.764555 },
  l: { baseUnit: 'm3', factor: 0.001 },
  liters: { baseUnit: 'm3', factor: 0.001 },
  litre: { baseUnit: 'm3', factor: 0.001 },

  // Power (Standard: kW)
  kw: { baseUnit: 'kW', factor: 1.0 },
  hp: { baseUnit: 'kW', factor: 0.7457 },
  ps: { baseUnit: 'kW', factor: 0.7355 },

  // Force (Standard: kN)
  kn: { baseUnit: 'kN', factor: 1.0 },
  kgf: { baseUnit: 'kN', factor: 0.00980665 },

  // Pressure (Standard: bar)
  bar: { baseUnit: 'bar', factor: 1.0 },
  mpa: { baseUnit: 'bar', factor: 10.0 },
  psi: { baseUnit: 'bar', factor: 0.0689476 },

  // Time (Standard: s)
  s: { baseUnit: 's', factor: 1.0 },
  sec: { baseUnit: 's', factor: 1.0 },
  seconds: { baseUnit: 's', factor: 1.0 },
  min: { baseUnit: 's', factor: 60.0 },

  // Fuel Rate (Standard: L/hr)
  'l/hr': { baseUnit: 'L/hr', factor: 1.0 },
  'l/h': { baseUnit: 'L/hr', factor: 1.0 },
  'gal/hr': { baseUnit: 'L/hr', factor: 3.78541 },
};

/**
 * Generic unit conversion function
 * @param {number} value - Floating point raw value
 * @param {string} fromUnit - Extracted unit string
 * @param {string} targetStandardUnit - Target standard unit from AttributeMaster
 * @returns {{ normalizedValue: number, normalizedUnit: string }}
 */
export function convertToStandardUnit(value, fromUnit, targetStandardUnit = null) {
  if (value === null || value === undefined || isNaN(value)) {
    return { normalizedValue: null, normalizedUnit: targetStandardUnit || fromUnit || '' };
  }

  if (!fromUnit) {
    return { normalizedValue: value, normalizedUnit: targetStandardUnit || '' };
  }

  const cleanFrom = fromUnit.trim().toLowerCase();
  const cleanTarget = targetStandardUnit ? targetStandardUnit.trim().toLowerCase() : null;

  // If units match directly (e.g. kg to kg, mm to mm, m3 to m3)
  if (cleanTarget && (cleanFrom === cleanTarget || (cleanFrom === 'm³' && cleanTarget === 'm3'))) {
    return { normalizedValue: value, normalizedUnit: targetStandardUnit };
  }

  const fromConfig = UNIT_CONVERSION_RATES[cleanFrom];
  const targetConfig = cleanTarget ? UNIT_CONVERSION_RATES[cleanTarget] : null;

  if (fromConfig && targetConfig && fromConfig.baseUnit === targetConfig.baseUnit) {
    // Convert from source unit to base unit, then from base unit to target unit
    const valueInBase = value * fromConfig.factor;
    const valueInTarget = valueInBase / targetConfig.factor;
    return {
      normalizedValue: parseFloat(valueInTarget.toFixed(4)),
      normalizedUnit: targetStandardUnit,
    };
  }

  if (fromConfig) {
    // Convert to standard base unit
    return {
      normalizedValue: parseFloat((value * fromConfig.factor).toFixed(4)),
      normalizedUnit: targetStandardUnit || fromConfig.baseUnit,
    };
  }

  // Default fallback: return value as is
  return {
    normalizedValue: value,
    normalizedUnit: targetStandardUnit || fromUnit,
  };
}
