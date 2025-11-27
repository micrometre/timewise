import { TaxCalculation } from '@/types';

// UK Tax Year 2024/25 rates
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const TAX_RATES = {
  BASIC: 0.20,
  HIGHER: 0.40,
  ADDITIONAL: 0.45,
};

// National Insurance rates (Class 1 Employee)
const NI_THRESHOLD = 12570;
const NI_UPPER_THRESHOLD = 50270;
const NI_RATE_LOWER = 0.08; // 8% between thresholds
const NI_RATE_UPPER = 0.02; // 2% above upper threshold

export function calculateTax(grossIncome: number): TaxCalculation {
  let incomeTax = 0;
  let nationalInsurance = 0;

  // Calculate Personal Allowance (reduces if income > £100,000)
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (grossIncome > 100000) {
    const reduction = Math.floor((grossIncome - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxableIncome = Math.max(0, grossIncome - personalAllowance);

  // Calculate Income Tax
  if (taxableIncome > 0) {
    if (taxableIncome <= BASIC_RATE_LIMIT - personalAllowance) {
      // Basic rate only
      incomeTax = taxableIncome * TAX_RATES.BASIC;
    } else if (taxableIncome <= HIGHER_RATE_LIMIT - personalAllowance) {
      // Basic + Higher rate
      const basicAmount = BASIC_RATE_LIMIT - personalAllowance;
      const higherAmount = taxableIncome - basicAmount;
      incomeTax = basicAmount * TAX_RATES.BASIC + higherAmount * TAX_RATES.HIGHER;
    } else {
      // Basic + Higher + Additional rate
      const basicAmount = BASIC_RATE_LIMIT - personalAllowance;
      const higherAmount = HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT;
      const additionalAmount = taxableIncome - (HIGHER_RATE_LIMIT - personalAllowance);
      incomeTax =
        basicAmount * TAX_RATES.BASIC +
        higherAmount * TAX_RATES.HIGHER +
        additionalAmount * TAX_RATES.ADDITIONAL;
    }
  }

  // Calculate National Insurance
  if (grossIncome > NI_THRESHOLD) {
    if (grossIncome <= NI_UPPER_THRESHOLD) {
      nationalInsurance = (grossIncome - NI_THRESHOLD) * NI_RATE_LOWER;
    } else {
      const lowerBand = (NI_UPPER_THRESHOLD - NI_THRESHOLD) * NI_RATE_LOWER;
      const upperBand = (grossIncome - NI_UPPER_THRESHOLD) * NI_RATE_UPPER;
      nationalInsurance = lowerBand + upperBand;
    }
  }

  const totalDeductions = incomeTax + nationalInsurance;
  const netIncome = grossIncome - totalDeductions;
  const effectiveRate = grossIncome > 0 ? (totalDeductions / grossIncome) * 100 : 0;

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    nationalInsurance,
    totalDeductions,
    netIncome,
    effectiveRate,
  };
}

export function calculateMonthlyTax(monthlyGross: number): TaxCalculation {
  const annualGross = monthlyGross * 12;
  const annualCalc = calculateTax(annualGross);

  return {
    grossIncome: monthlyGross,
    taxableIncome: annualCalc.taxableIncome / 12,
    incomeTax: annualCalc.incomeTax / 12,
    nationalInsurance: annualCalc.nationalInsurance / 12,
    totalDeductions: annualCalc.totalDeductions / 12,
    netIncome: annualCalc.netIncome / 12,
    effectiveRate: annualCalc.effectiveRate,
  };
}
