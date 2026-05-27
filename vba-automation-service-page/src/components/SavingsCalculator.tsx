/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  Calculator, 
  Info, 
  Check, 
  Award,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface SavingsCalculatorProps {
  initialHourlyRate?: number;
  initialHoursPerWeek?: number;
  initialTeamSize?: number;
  onCtaClick?: () => void;
}

export default function SavingsCalculator({ 
  initialHourlyRate = 250, 
  initialHoursPerWeek = 10, 
  initialTeamSize = 3,
  onCtaClick
}: SavingsCalculatorProps) {
  // Inputs
  const [hourlyRate, setHourlyRate] = useState<number>(initialHourlyRate);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(initialHoursPerWeek);
  const [teamSize, setTeamSize] = useState<number>(initialTeamSize);
  const [vbaProjectCost, setVbaProjectCost] = useState<number>(65000); // Typical starting custom macro fee is 65k PHP
  const [frequentErrorsCost, setFrequentErrorsCost] = useState<boolean>(true);
  const [formulaCrashesCost, setFormulaCrashesCost] = useState<boolean>(false);
  const [efficiencyBoost, setEfficiencyBoost] = useState<number>(90); // default 90%

  // Calculations
  const manualHoursYearly = hoursPerWeek * teamSize * 52;
  const directLaborCostYearly = manualHoursYearly * hourlyRate;
  
  // Extra costs matching checkboxes
  const rawErrorCostYearly = (frequentErrorsCost ? 24000 : 0) + (formulaCrashesCost ? 35000 : 0);
  const totalManualCostYearly = directLaborCostYearly + rawErrorCostYearly;

  const hoursSavedYearly = Math.round(manualHoursYearly * (efficiencyBoost / 100));
  const laborCostSavedYearly = Math.round(directLaborCostYearly * (efficiencyBoost / 100));
  const netYearlySavingsPhp = laborCostSavedYearly + rawErrorCostYearly;
  
  // Payback period
  const monthlySavings = netYearlySavingsPhp / 12;
  const paybackMonths = monthlySavings > 0 ? (vbaProjectCost / monthlySavings) : 0;

  // Sync inputs with props if they alter from quizcompletion
  useEffect(() => {
    setHourlyRate(initialHourlyRate);
    setHoursPerWeek(initialHoursPerWeek);
    setTeamSize(initialTeamSize);
  }, [initialHourlyRate, initialHoursPerWeek, initialTeamSize]);

  // Generates coordinate paths for our interactive trend line
  const maxCost = totalManualCostYearly;
  const getSimulatedCoordinates = () => {
    const pointsManual: string[] = [];
    const pointsVba: string[] = [];
    const width = 360;
    const height = 140;
    
    for (let month = 0; month <= 12; month++) {
      const x = (month / 12) * width;
      
      // Manual costs grow linear
      const yManual = height - ((totalManualCostYearly / 12 * month) / (maxCost * 1.1)) * height - 10;
      pointsManual.push(`${x},${yManual}`);

      // VBA starts with high cost upfront then stays near flat
      const accumVbaCost = vbaProjectCost + (totalManualCostYearly * (1 - efficiencyBoost/100) / 12 * month);
      const yVba = height - (accumVbaCost / (maxCost * 1.1)) * height - 10;
      pointsVba.push(`${x},${yVba}`);
    }
    return { manualPath: pointsManual.join(' '), vbaPath: pointsVba.join(' ') };
  };

  const { manualPath, vbaPath } = getSimulatedCoordinates();

  return (
    <div id="savings-calculator-section" className="scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
          <Calculator size={12} />
          Simulate Cost Efficiency in Real-time
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-zinc-900 dark:text-white tracking-tight">
          Spreadsheet Savings Calculator
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
          Adjust the sliders below in Philippine Peso (PHP) to witness how manual processes waste capital versus automated Microsoft Office VBA programs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders and custom controls */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl space-y-6">
          <h3 className="font-semibold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800 text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-500" />
            1. Configure Labor & Inefficiencies
          </h3>

          {/* Slider: Hourly Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="hourly-rate-slider" className="font-semibold text-zinc-700 dark:text-zinc-300">
                Staff Hourly Value / Salary Rate
              </label>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-base bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded">
                ₱{hourlyRate} / hr
              </span>
            </div>
            <input
              id="hourly-rate-slider"
              type="range"
              min="50"
              max="1500"
              step="10"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>₱50 (Minimum rate)</span>
              <span>₱500 (Standard rate)</span>
              <span>₱1,500+ (Specialist rate)</span>
            </div>
          </div>

          {/* Slider: Hours Per Week */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="hours-slider" className="font-semibold text-zinc-700 dark:text-zinc-300">
                Repetitive Manual Spreadsheet Hours / Week
              </label>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-base bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded">
                {hoursPerWeek} Hours
              </span>
            </div>
            <input
              id="hours-slider"
              type="range"
              min="1"
              max="50"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>1 hr (Minor automation)</span>
              <span>20 hrs (A half-time role)</span>
              <span>50 hrs (Heavy bottleneck)</span>
            </div>
          </div>

          {/* Slider: Team size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="team-size-slider" className="font-semibold text-zinc-700 dark:text-zinc-300">
                Team Size Doing Repetitive Inputting
              </label>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-base bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded">
                {teamSize} Employees
              </span>
            </div>
            <input
              id="team-size-slider"
              type="range"
              min="1"
              max="100"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>1 Staff</span>
              <span>25 Users</span>
              <span>50 Team Members</span>
              <span>100+ Corporate Division</span>
            </div>
          </div>

          {/* Slider: One-time Custom VBA script Budget */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="macro-budget-slider" className="font-semibold text-zinc-700 dark:text-zinc-300">
                Estimated One-Time Capital Investment in VBA Applet
              </label>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded">
                ₱{vbaProjectCost.toLocaleString('en-US')}
              </span>
            </div>
            <input
              id="macro-budget-slider"
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={vbaProjectCost}
              onChange={(e) => setVbaProjectCost(Number(e.target.value))}
              className="w-full accent-indigo-505 cursor-pointer h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>₱15k (Mini Button)</span>
              <span>₱65k (Standard Tool)</span>
              <span>₱250k (Unified ERP macro framework)</span>
            </div>
          </div>

          {/* Extraneous loss Checkboxes */}
          <div className="space-y-3 pt-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Hidden Human Errors Costs & Inconsistencies Yearly (PHP)
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setFrequentErrorsCost(!frequentErrorsCost)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  frequentErrorsCost 
                    ? 'border-red-400/50 bg-red-500/5 text-red-950 dark:text-red-100'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center ${frequentErrorsCost ? 'bg-red-500 text-white border-red-500' : 'border-zinc-300'}`}>
                  {frequentErrorsCost && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-white">Accidental Typing Errors (₱24,000 /yr waste)</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Typing miscalculations resulting in incorrect price computation quotes or classroom marks.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormulaCrashesCost(!formulaCrashesCost)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  formulaCrashesCost 
                    ? 'border-red-400/50 bg-red-500/5 text-red-950 dark:text-red-100'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center ${formulaCrashesCost ? 'bg-red-500 text-white border-red-500' : 'border-zinc-300'}`}>
                  {formulaCrashesCost && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-white">Inadvertent formulas deletion (₱35,000 /yr waste)</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Employees wiping out calculations and wasting whole days restoring corrupted backup copies.</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic simulation results card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-800 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

            <div className="relative">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-6">
                <div>
                  <span className="text-[10px] text-teal-400 uppercase tracking-wider font-mono">Automated State Efficiency Projections</span>
                  <h3 className="text-xl font-bold font-sans text-white">Your Annual Financial Growth</h3>
                </div>
                <Award className="text-teal-400 animate-bounce" size={24} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                  <span className="text-[10px] text-zinc-400 block mb-1">Total Traditional Cost / Year</span>
                  <span className="text-lg font-bold text-rose-500 font-sans">
                    ₱{totalManualCostYearly.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block mb-1">New Simulated Net Cost</span>
                  <span className="text-lg font-bold text-emerald-400 font-sans">
                    ₱{Math.round(totalManualCostYearly - netYearlySavingsPhp).toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-800/80 p-5 rounded-2xl border border-teal-500/30 text-center mb-6">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">Net Annual Capital Reclaimed</span>
                <p id="calc-yearly-savings-display" className="text-3xl md:text-4xl font-black text-emerald-400 font-mono my-2 animate-pulse">
                  ₱{netYearlySavingsPhp.toLocaleString('en-US')}
                </p>
                <span className="text-[11px] text-zinc-400">Equivalent to reclaiming approximately <strong className="text-white font-sans">{hoursSavedYearly} hours</strong> of human time.</span>
              </div>

              {/* Payback timeline KPI */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-800/40 p-3 rounded-lg flex items-center gap-2.5">
                  <Clock size={16} className="text-amber-500 shrink-0" />
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Recoup Timeline</span>
                    <strong className="text-zinc-200 font-mono text-xs">
                      {paybackMonths <= 1 
                        ? `${Math.round(paybackMonths * 30)} Days` 
                        : `${paybackMonths.toFixed(1)} Months`}
                    </strong>
                  </div>
                </div>

                <div className="bg-zinc-800/40 p-3 rounded-lg flex items-center gap-2.5">
                  <TrendingDown size={16} className="text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">First-Year ROI</span>
                    <strong className="text-zinc-200 font-mono text-xs">
                      {vbaProjectCost > 0 ? `${((netYearlySavingsPhp / vbaProjectCost) * 100).toFixed(0)}%` : '---'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Visual Financial Gap Graph over 12 Months */}
          <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono font-bold">Accumulative 12-Month Expense Gap</span>
              <div className="flex gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Manual</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> VBA Automated (ROI)</span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="w-full h-36">
              <svg viewBox="0 0 360 140" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="360" y2="20" className="stroke-zinc-100 dark:stroke-zinc-900" strokeWidth="1" />
                <line x1="0" y1="65" x2="360" y2="65" className="stroke-zinc-100 dark:stroke-zinc-900" strokeWidth="1" />
                <line x1="0" y1="110" x2="360" y2="110" className="stroke-zinc-100 dark:stroke-zinc-900" strokeWidth="1" />

                {/* Plot Paths */}
                {/* Manual line */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  points={manualPath}
                />
                {/* VBA line */}
                <polyline
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                  points={vbaPath}
                />

                {/* Legend dots */}
                <circle cx="360" cy={manualPath.split(' ').pop()?.split(',')[1]} r="4" className="fill-red-500" />
                <circle cx="360" cy={vbaPath.split(' ').pop()?.split(',')[1]} r="4" className="fill-teal-500" />
              </svg>
            </div>
            <div className="flex justify-between font-mono text-[9px] text-zinc-400 mt-2">
              <span>Month 0</span>
              <span>Month 3</span>
              <span>Month 6</span>
              <span>Month 9</span>
              <span>Month 12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
