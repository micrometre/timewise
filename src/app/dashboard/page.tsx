'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { WorkEntry } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { calculateTax } from '@/lib/taxCalculator';
import { database, initializeDatabase } from '@/lib/database';

export default function Dashboard() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDb();
  }, []);

  const initDb = async () => {
    try {
      setLoading(true);
      await initializeDatabase();
      setDbInitialized(true);
      await loadEntries();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    try {
      const data = await database.getWorkEntries();
      setEntries(data);
      
      const hours = data.reduce((sum: number, entry: WorkEntry) => sum + entry.hours, 0);
      const earnings = data.reduce((sum: number, entry: WorkEntry) => sum + entry.value, 0);
      
      setTotalHours(hours);
      setTotalEarnings(earnings);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const taxCalc = calculateTax(totalEarnings);
  const recentEntries = entries.slice(-5).reverse();

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Overview of your work hours, earnings, and tax obligations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Database:</span>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                dbInitialized 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  dbInitialized ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span>{dbInitialized ? 'Connected (OPFS)' : 'Initializing...'}</span>
              </div>
            </div>
          </div>
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
                Add your first timesheet entry
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
