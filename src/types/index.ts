export interface WorkEntry {
  day: string;
  date: string;
  shift: string;
  hours: number;
  rate: number;
  value: number;
}

export interface TaxCalculation {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  totalDeductions: number;
  netIncome: number;
  effectiveRate: number;
}

export interface TaxBracket {
  name: string;
  threshold: number;
  rate: number;
}

export interface Period {
  month: string;
  year: number;
  totalHours: number;
  totalEarnings: number;
}
