import Papa from 'papaparse';
import { WorkEntry } from '@/types';

export function parseCSV(csvText: string): WorkEntry[] {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const entries: WorkEntry[] = [];

  result.data.forEach((row: any) => {
    if (row.Day && row.Hours && !isNaN(parseFloat(row.Hours))) {
      const hours = parseFloat(row.Hours) || 0;
      const rate = parseFloat(row.Rate) || 0;
      const valueStr = row[' Value'] || row.Value || '';
      const value = parseFloat(valueStr.replace(/[£,\s]/g, '')) || 0;

      entries.push({
        day: row.Day,
        date: row.Date,
        shift: row.Shift || '',
        hours,
        rate,
        value,
      });
    }
  });

  return entries;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
