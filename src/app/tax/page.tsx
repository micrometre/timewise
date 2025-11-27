'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { formatCurrency } from '@/lib/utils';
import { calculateTax, calculateMonthlyTax } from '@/lib/taxCalculator';

export default function TaxPage() {
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [useMonthly, setUseMonthly] = useState(false);
  const [savedIncome, setSavedIncome] = useState(0);

  useEffect(() => {
    // Load saved timesheet data
    const saved = localStorage.getItem('workEntries');
    if (saved) {
      const data = JSON.parse(saved);
      const total = data.reduce((sum: number, entry: any) => sum + entry.value, 0);
      setSavedIncome(total);
      setAnnualIncome(total.toString());
    }
  }, []);

  const income = useMonthly
    ? parseFloat(monthlyIncome) || 0
    : parseFloat(annualIncome) || 0;

  const taxCalc = useMonthly
    ? calculateMonthlyTax(income)
    : calculateTax(income);

  const handleUseTimesheetData = () => {
    setAnnualIncome(savedIncome.toString());
    setUseMonthly(false);
  };

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tax Calculator</h1>
          <p className="mt-2 text-gray-600">
            Calculate your UK income tax and National Insurance contributions
          </p>
        </div>

        {/* Input Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Income Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setUseMonthly(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  !useMonthly
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Annual Income
              </button>
              <button
                onClick={() => setUseMonthly(true)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  useMonthly
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Monthly Income
              </button>
            </div>

            {!useMonthly ? (
              <div>
                <label htmlFor="annual-income" className="label">
                  Annual Gross Income
                </label>
                <input
                  id="annual-income"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="Enter annual income"
                  className="input-field"
                />
                {savedIncome > 0 && (
                  <button
                    onClick={handleUseTimesheetData}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Use timesheet data: {formatCurrency(savedIncome)}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="monthly-income" className="label">
                  Monthly Gross Income
                </label>
                <input
                  id="monthly-income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="Enter monthly income"
                  className="input-field"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {income > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="text-sm font-medium text-gray-500">
                  Gross Income
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(taxCalc.grossIncome)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {useMonthly ? 'Per month' : 'Per year'}
                </div>
              </div>

              <div className="card">
                <div className="text-sm font-medium text-gray-500">
                  Income Tax
                </div>
                <div className="mt-2 text-2xl font-bold text-red-600">
                  {formatCurrency(taxCalc.incomeTax)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {useMonthly ? 'Per month' : 'Per year'}
                </div>
              </div>

              <div className="card">
                <div className="text-sm font-medium text-gray-500">
                  National Insurance
                </div>
                <div className="mt-2 text-2xl font-bold text-orange-600">
                  {formatCurrency(taxCalc.nationalInsurance)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {useMonthly ? 'Per month' : 'Per year'}
                </div>
              </div>

              <div className="card">
                <div className="text-sm font-medium text-gray-500">
                  Net Income
                </div>
                <div className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(taxCalc.netIncome)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {useMonthly ? 'Per month' : 'Per year'}
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tax Breakdown
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Gross Income</span>
                    <span className="font-semibold">
                      {formatCurrency(taxCalc.grossIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(taxCalc.incomeTax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">National Insurance</span>
                    <span className="font-semibold text-orange-600">
                      -{formatCurrency(taxCalc.nationalInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-gray-700 font-medium">
                      Total Deductions
                    </span>
                    <span className="font-bold text-red-600">
                      -{formatCurrency(taxCalc.totalDeductions)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg">
                    <span className="text-gray-900 font-bold">Net Income</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(taxCalc.netIncome)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tax Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Effective Tax Rate
                    </div>
                    <div className="text-3xl font-bold text-primary-600">
                      {taxCalc.effectiveRate.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Combined tax and NI rate
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Tax Year 2024/25 Rates:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Personal Allowance: £12,570</li>
                      <li>• Basic Rate (20%): £12,571 - £50,270</li>
                      <li>• Higher Rate (40%): £50,271 - £125,140</li>
                      <li>• Additional Rate (45%): Over £125,140</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      National Insurance:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 8% on £12,571 - £50,270</li>
                      <li>• 2% on income over £50,270</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
