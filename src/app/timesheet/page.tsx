'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { WorkEntry } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { database, initializeDatabase } from '@/lib/database';

export default function TimesheetPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    day: '',
    date: '',
    shift: '',
    startTime: '',
    endTime: '',
    hours: '',
    rate: '',
  });

  useEffect(() => {
    initDb();
  }, []);

  const initDb = async () => {
    try {
      setLoading(true);
      await initializeDatabase();
      setDbInitialized(true);
      await loadEntries();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Fallback to empty state
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    try {
      const data = await database.getWorkEntries();
      setEntries(data);
      calculateTotals(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const calculateTotals = (data: WorkEntry[]) => {
    const hours = data.reduce((sum, entry) => sum + entry.hours, 0);
    const earnings = data.reduce((sum, entry) => sum + entry.value, 0);
    setTotalHours(hours);
    setTotalEarnings(earnings);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all entries?')) {
      try {
        await database.clearAllEntries();
        setEntries([]);
        setTotalHours(0);
        setTotalEarnings(0);
      } catch (error) {
        console.error('Failed to clear entries:', error);
        alert('Failed to clear entries. Please try again.');
      }
    }
  };

  const calculateHoursFromTimes = (start: string, end: string): string => {
    if (!start || !end) return '';
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes;
    const hours = totalMinutes / 60;
    
    return hours.toFixed(2);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If date changes, automatically update the day
    if (name === 'date' && value) {
      const dateObj = new Date(value);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[dateObj.getDay()];
      
      setFormData(prev => ({
        ...prev,
        date: value,
        day: dayName
      }));
    } else if (name === 'startTime' || name === 'endTime') {
      // Calculate hours when start or end time changes
      const newFormData = {
        ...formData,
        [name]: value
      };
      
      const calculatedHours = calculateHoursFromTimes(
        name === 'startTime' ? value : formData.startTime,
        name === 'endTime' ? value : formData.endTime
      );
      
      setFormData({
        ...newFormData,
        hours: calculatedHours
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hours = parseFloat(formData.hours);
    const rate = parseFloat(formData.rate);
    
    if (!formData.day || !formData.date || isNaN(hours) || isNaN(rate)) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    const value = hours * rate;

    // Convert date from YYYY-MM-DD to DD/MM/YY format
    const dateParts = formData.date.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0].slice(2)}`;

    const newEntry: Omit<WorkEntry, 'id' | 'createdAt'> = {
      day: formData.day,
      date: formattedDate,
      shift: formData.shift + (formData.startTime && formData.endTime ? ` (${formData.startTime}-${formData.endTime})` : ''),
      hours,
      rate,
      value,
    };

    try {
      await database.addWorkEntry(newEntry);
      await loadEntries();

      // Reset form
      setFormData({
        day: '',
        date: '',
        shift: '',
        startTime: '',
        endTime: '',
        hours: '',
        rate: '',
      });
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to add entry. Please try again.');
    }
  };

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
              <p className="mt-2 text-gray-600">
                Add and manage your work hours
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

        {/* Loading State */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 text-lg">Initializing database...</p>
          </div>
        ) : (
          <>
            {/* Manual Entry Form */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Work Entry</h2>
              <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="day" className="label">
                  Day <span className="text-red-500">*</span>
                </label>
                <input
                  id="day"
                  name="day"
                  type="text"
                  value={formData.day}
                  onChange={handleFormChange}
                  placeholder="e.g., Monday"
                  className="input-field"
                  required
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="date" className="label">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="shift" className="label">
                  Shift
                </label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={(e) => handleFormChange(e as any)}
                  className="input-field"
                >
                  <option value="">Select shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div>
                <label htmlFor="startTime" className="label">
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  step="900"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="label">
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  step="900"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="hours" className="label">
                  Hours <span className="text-red-500">*</span>
                </label>
                <input
                  id="hours"
                  name="hours"
                  type="number"
                  step="0.01"
                  value={formData.hours}
                  onChange={handleFormChange}
                  placeholder="0.00"
                  className="input-field"
                  required
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="rate" className="label">
                  Hourly Rate (£) <span className="text-red-500">*</span>
                </label>
                <input
                  id="rate"
                  name="rate"
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={handleFormChange}
                  placeholder="0.00"
                  className="input-field"
                  required
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  Add Entry
                </button>
              </div>
            </div>
          </form>
        </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Total Entries</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {entries.length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Total Hours</div>
            <div className="mt-2 text-3xl font-bold text-primary-600">
              {totalHours.toFixed(2)}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Total Earnings</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </div>
          </div>
            </div>

            {/* Entries Table */}
                {entries.length > 0 ? (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Work Entries</h2>
                  <button onClick={handleClearAll} className="btn-secondary">
                    Clear All Data
                  </button>
                </div>
                    <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earned
                    </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {entry.day}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {entry.shift || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {entry.hours.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                            {formatCurrency(entry.rate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(entry.value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">
                          Total
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          {totalHours.toFixed(2)}
                        </td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(totalEarnings)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">No entries yet. Add a work entry to get started.</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
