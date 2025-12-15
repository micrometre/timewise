
'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { calculateMonthlyTax } from '@/lib/taxCalculator';
import { formatCurrency } from '@/lib/utils';

export default function Home() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const income = parseFloat(monthlyIncome) || 0;
  const taxCalc = calculateMonthlyTax(income);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Hero Section with Integrated Tax Calculator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                🇬🇧 UK Tax Year 2024/25
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Know Your <span className="text-primary-600">Take-Home Pay</span> Instantly
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Enter your monthly salary and see exactly how much you'll take home after tax and National Insurance. No signup required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/tax"
                  className="bg-white hover:bg-gray-50 text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-primary-600 transition-colors duration-200"
                >
                  Full Tax Calculator
                </Link>
              </div>
            </div>

            {/* Right side - Tax Calculator Widget */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Monthly Tax Calculator</h2>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">FREE</span>
              </div>
              
              {/* Input */}
              <div className="mb-6">
                <label htmlFor="monthly-salary" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Monthly Gross Salary
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-semibold">£</span>
                  <input
                    id="monthly-salary"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="3,000"
                    className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Results - Always visible with placeholder or real values */}
              <div className="space-y-4">
                {/* Take Home Pay - Highlighted */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-green-700">Your Take-Home Pay</div>
                      <div className="text-xs text-green-600">After all deductions</div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {income > 0 ? formatCurrency(taxCalc.netIncome) : '£—'}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Gross Salary</span>
                    <span className="font-semibold text-gray-900">
                      {income > 0 ? formatCurrency(taxCalc.grossIncome) : '£—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-semibold text-red-600">
                      {income > 0 ? `-${formatCurrency(taxCalc.incomeTax)}` : '£—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">National Insurance</span>
                    <span className="font-semibold text-orange-600">
                      {income > 0 ? `-${formatCurrency(taxCalc.nationalInsurance)}` : '£—'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">Effective Tax Rate</span>
                    <span className="font-bold text-primary-600">
                      {income > 0 ? `${taxCalc.effectiveRate.toFixed(1)}%` : '—%'}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="text-xs text-gray-500 text-center pt-2">
                  Based on UK Tax Year 2024/25 rates • Updates in real-time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use Our Calculator Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Use Our Tax Calculator?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Instant, accurate UK tax calculations with no signup required
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">See your take-home pay as you type</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">2024/25 Rates</h3>
                <p className="text-sm text-gray-600">Up-to-date with current UK tax year</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">100% Private</h3>
                <p className="text-sm text-gray-600">Your data never leaves your browser</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💷</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free Forever</h3>
                <p className="text-sm text-gray-600">No hidden fees, no subscriptions</p>
              </div>
            </div>
          </div>
        </div>





        {/* Technology Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Built with Modern Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Next.js 14</h3>
                <p className="text-gray-600">
                  Built with the latest Next.js framework for fast, responsive performance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Privacy Focused</h3>
                <p className="text-gray-600">
                  No servers, no tracking, no accounts. Your data never leaves your device.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© 2025 TimeWise. Built with ❤️ for UK workers.</p>
            <p className="mt-2 text-sm">
              Browser Requirements: Chrome 86+, Edge 86+, Firefox 111+, Safari 15.2+
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
