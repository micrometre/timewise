# TimeWise

A Next.js application for managing work hours, tracking salary, and calculating UK tax obligations with smart time management features.

## Features

- 📊 **Dashboard**: Overview of total hours worked, earnings, and tax breakdown
- ⏰ **Smart Timesheet**: Add work entries with automatic calculations and date handling
- 💰 **Tax Calculator**: Calculate UK income tax and National Insurance contributions
- 📈 **Real-time Calculations**: Automatic tax and hours calculations based on current UK rates (2024/25)
- 🕒 **Intelligent Time Tracking**: Auto-calculate hours from start/end times
- 📅 **Date Management**: Automatic day detection from selected dates
- 💾 **Local Storage**: Data persists securely in your browser

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Managing Timesheets

1. Navigate to the **Timesheet** page
2. Fill in the work entry form:
   - Select a date (day auto-populates)
   - Choose shift type (Morning/Afternoon/Evening/Night)
   - Select start and end times (hours auto-calculate)
   - Enter your hourly rate
3. Click "Add Entry"
4. Your work entries will be displayed in the table below

### Tax Calculator

1. Navigate to the **Tax Calculator** page
2. Choose between Annual or Monthly income
3. Enter your gross income
4. View your tax breakdown, including:
   - Income Tax
   - National Insurance
   - Net Income
   - Effective tax rate

### Dashboard

The dashboard provides an at-a-glance view of:
- Total hours worked
- Gross income
- Tax and NI deductions
- Net income after tax
- Recent work entries

## Tax Rates (2024/25)

### Income Tax
- Personal Allowance: £12,570
- Basic Rate (20%): £12,571 - £50,270
- Higher Rate (40%): £50,271 - £125,140
- Additional Rate (45%): Over £125,140

### National Insurance
- 8% on income between £12,571 - £50,270
- 2% on income over £50,270

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── timesheet/
│   │   └── page.tsx       # Smart timesheet management
│   ├── tax/
│   │   └── page.tsx       # Tax calculator
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   └── Navigation.tsx     # Navigation component
├── lib/
│   ├── taxCalculator.ts   # Tax calculation logic
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## Key Features

### Automatic Calculations
- Hours automatically calculated from start/end times
- Handles overnight shifts correctly
- Day of week auto-populates from selected date
- Earnings calculated in real-time

### Smart Form Design
- Date picker for easy date selection
- Time pickers with 15-minute intervals
- Shift type dropdown (Morning/Afternoon/Evening/Night)
- All calculations update automatically

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

---

**TimeWise** - Track your time wisely, plan your earnings confidently.
