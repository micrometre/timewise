'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { WorkEntry } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { calculateTax } from '@/lib/taxCalculator';

export default function Home() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem('workEntries');
    if (saved) {
      const data = JSON.parse(saved);
      setEntries(data);
      
      const hours = data.reduce((sum: number, entry: WorkEntry) => sum + entry.hours, 0);
      const earnings = data.reduce((sum: number, entry: WorkEntry) => sum + entry.value, 0);
      
      setTotalHours(hours);
      setTotalEarnings(earnings);
    }
  }, []);

  const taxCalc = calculateTax(totalEarnings);
  const recentEntries = entries.slice(-5).reverse();

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your work hours, earnings, and tax obligations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Total Hours</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {totalHours.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {(totalHours / 4).toFixed(1)} weeks
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Gross Income</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </div>
            <div className="mt-1 text-sm text-gray-500">Before tax</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Tax & NI</div>
            <div className="mt-2 text-3xl font-bold text-red-600">
              {formatCurrency(taxCalc.totalDeductions)}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {taxCalc.effectiveRate.toFixed(1)}% effective rate
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Net Income</div>
            <div className="mt-2 text-3xl font-bold text-primary-600">
              {formatCurrency(taxCalc.netIncome)}
            </div>
            <div className="mt-1 text-sm text-gray-500">After deductions</div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tax Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Income Tax</span>
              <span className="font-semibold">{formatCurrency(taxCalc.incomeTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">National Insurance</span>
              <span className="font-semibold">{formatCurrency(taxCalc.nationalInsurance)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700 font-medium">Total Deductions</span>
              <span className="font-bold text-lg">{formatCurrency(taxCalc.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Entries</h2>
            <a href="/timesheet" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all →
            </a>
          </div>
          {recentEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Shift
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Earned
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.day}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.shift}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {entry.hours.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(entry.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No work entries yet.</p>
              <a href="/timesheet" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                Import your timesheet
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
