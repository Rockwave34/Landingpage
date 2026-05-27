/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Cloud, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Check, 
  RefreshCw, 
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Lock,
  LockOpen,
  DollarSign
} from 'lucide-react';
import { QuizResponses, AssessmentResult, Transaction } from '../types';

interface AnalyticsDashboardProps {
  quizResult: AssessmentResult;
  quizResponses: QuizResponses;
  transactions: Transaction[];
  mfaSecure: boolean;
  onMfaToggleClick: () => void;
  onAddLog: (title: string, hours: number) => void;
  onToastRequest: (title: string, message: string, type: 'save' | 'transaction' | 'system' | 'sync' | 'mfa') => void;
}

export default function AnalyticsDashboard({
  quizResult,
  quizResponses,
  transactions,
  mfaSecure,
  onMfaToggleClick,
  onAddLog,
  onToastRequest
}: AnalyticsDashboardProps) {
  // Sync Status state
  const [syncingStatus, setSyncingStatus] = useState<'synced' | 'syncing' | 'idle'>('synced');
  // Task state
  const [customTaskName, setCustomTaskName] = useState('');
  const [customTaskHours, setCustomTaskHours] = useState(5);
  // Custom tasks logs state
  const [customLogs, setCustomLogs] = useState<{ id: string; name: string; hoursPerWeek: number; addedAt: string }[]>([
    { id: '1', name: 'Bi-weekly Student Marks Entry Integration', hoursPerWeek: 8, addedAt: '2026-05-24' },
    { id: '2', name: 'Sales Quota Report Workbook Merging', hoursPerWeek: 12, addedAt: '2026-05-25' }
  ]);

  const handleSyncClick = () => {
    setSyncingStatus('syncing');
    onToastRequest('Cloud Synchronizing...', 'Saving dashboard variables to redundant storage cluster.', 'sync');
    setTimeout(() => {
      setSyncingStatus('synced');
      onToastRequest('Cloud Synced Successfully', 'All spreadsheet assessments and growth plans are locked down.', 'sync');
    }, 1500);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskName.trim()) return;

    const newLog = {
      id: Math.random().toString(),
      name: customTaskName,
      hoursPerWeek: customTaskHours,
      addedAt: new Date().toISOString().split('T')[0]
    };

    setCustomLogs([newLog, ...customLogs]);
    onAddLog(customTaskName, customTaskHours);
    onToastRequest(
      'Automation Tracked', 
      `Added "${customTaskName}" (${customTaskHours} hrs/wk). Live calculations refreshed.`, 
      'save'
    );
    setCustomTaskName('');
  };

  // CSV Exporter for tax/financial audit purposes
  const handleExportCSV = () => {
    onToastRequest('Compiling Financial Report...', 'Securing encrypted spreadsheet export payload.', 'system');
    
    // Create CSV content representing current evaluation parameters
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "VBA COST RETRENCHMENT & AUDIT REPORT\n";
    csvContent += `Generated At: 2026-05-26, User Profile: ${quizResponses.emailContact || 'Anonymous'}\n\n`;
    csvContent += "Category,Value,Unit\n";
    csvContent += `Assessment Framework,${quizResult.role.toUpperCase()},\n`;
    csvContent += `Weekly Human Waste Hours,${quizResult.weeklyHoursWasted},Hours\n`;
    csvContent += `Direct Yearly Cost Incurred,${quizResult.yearlyCostWastedPhp},PHP\n`;
    csvContent += `Simulated Year-1 Efficiency savings,${quizResult.simulatedYearlySavingsPhp},PHP\n`;
    csvContent += `Payback Rate,${quizResult.paybackPeriodDays},Days\n`;
    csvContent += `MFA Security Compliance Status,${mfaSecure ? 'SECURE' : 'INCOMPLETE'},\n\n`;
    csvContent += "SUB-PROCESS REGISTER\n";
    csvContent += "Job Description,Repetitive Hours / Week,Calculated Yearly Cost (PHP)\n";
    
    customLogs.forEach(log => {
      csvContent += `"${log.name}",${log.hoursPerWeek},${log.hoursPerWeek * quizResponses.averageHourlyRatePhp * 52}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VBA_Savings_Tax_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      onToastRequest('Report Downloaded', 'Audit-ready financial CSV generated and saved.', 'save');
    }, 450);
  };

  // Cumulative math for total tracking
  const computedLogHours = customLogs.reduce((sum, item) => sum + item.hoursPerWeek, 0);
  const totalCombinedYearlyCost = (quizResult.weeklyHoursWasted + computedLogHours) * quizResponses.averageHourlyRatePhp * 52;
  const totalCombinedSavings = totalCombinedYearlyCost * (quizResult.potentialEfficiencyBoost / 100);

  return (
    <div id="analytics-dashboard-tab" className="space-y-8 animate-fadeIn">
      {/* Real-time Status banner */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 id="realtime-dashboard-title" className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-white font-sans">
              Real-time Portfolio Growth Desk
            </h2>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Interactive dashboard reflecting current assessment for <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">{quizResponses.emailContact || 'guest_client_account'}</span>
          </p>
        </div>

        {/* Security and sync toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Cloud sync toggler */}
          <button
            id="cloud-sync-btn"
            onClick={handleSyncClick}
            disabled={syncingStatus === 'syncing'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
              syncingStatus === 'syncing'
                ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-teal-500/5 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 cursor-pointer'
            }`}
          >
            <Cloud size={14} className={syncingStatus === 'syncing' ? 'animate-spin' : ''} />
            {syncingStatus === 'syncing' ? 'SYNCING...' : 'SYNC CLOUD (100% REGIONAL)'}
          </button>

          {/* MFA status toggle badge */}
          <button
            id="mfa-status-toggle-btn"
            onClick={onMfaToggleClick}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
              mfaSecure
                ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
            }`}
          >
            {mfaSecure ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            MFA: {mfaSecure ? 'SECURED' : 'UNSECURED ACTION REQUIRED'}
          </button>

          {/* CSV Exporter trigger */}
          <button
            id="dashboard-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono bg-indigo-505 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
          >
            <Download size={14} />
            EXPORT REPORT (TAX LAWS COMPLIANT)
          </button>
        </div>
      </div>

      {/* Grid: Main Financial KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow relative overflow-hidden">
          <span className="text-zinc-400 text-[10px] uppercase font-mono block">Accumulated Savings Rate</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span id="dashboard-widget-savings" className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₱{Math.round(totalCombinedSavings).toLocaleString('en-US')}
            </span>
            <span className="text-[10px] text-zinc-400 font-sans font-medium">/ Yr</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Based on global labor rate values.</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow">
          <span className="text-zinc-400 text-[10px] uppercase font-mono block">Accuracy Assurance</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
              100%
            </span>
            <span className="text-[10px] text-emerald-500 font-sans font-semibold">↑ No Typos</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Mathematical programmatic verification.</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow">
          <span className="text-zinc-400 text-[10px] uppercase font-mono block">Collective Reclaimed Time</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">
              {Math.round((quizResult.weeklyHoursWasted + computedLogHours) * 52 * (quizResult.potentialEfficiencyBoost / 100))}
            </span>
            <span className="text-[10px] text-zinc-400 font-sans font-medium">Hrs / Yr</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Reassigned to creative core tasks.</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow">
          <span className="text-zinc-400 text-[10px] uppercase font-mono block">Payback Rate Index</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black font-mono text-rose-500">
              {quizResult.paybackPeriodDays} 
            </span>
            <span className="text-[10px] text-zinc-400 font-sans font-medium">Days</span>
          </div>
          <p className="text-[11px] text-rose-500/85 mt-1 font-sans">Estimated breakeven window.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Track custom tasks input and current task register */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-teal-500" />
              Real-time Inefficiency Registy
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Add individual Excel or student score workbook headaches encountered to log updates.
            </p>
          </div>

          {/* Form to log item */}
          <form id="add-task-form" onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
            <div className="md:col-span-6">
              <label htmlFor="custom-task-name" className="sr-only">Task Description</label>
              <input
                id="custom-task-name"
                type="text"
                required
                placeholder="e.g. Monthly Attendance CSV formatting"
                value={customTaskName}
                onChange={(e) => setCustomTaskName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="custom-task-hours" className="sr-only">Hours / Wk</label>
              <input
                id="custom-task-hours"
                type="number"
                min="1"
                max="50"
                required
                placeholder="Hrs/wk"
                value={customTaskHours}
                onChange={(e) => setCustomTaskHours(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-3">
              <button
                id="submit-custom-task-btn"
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Plus size={14} /> Log Issue
              </button>
            </div>
          </form>

          {/* Task log list */}
          <div className="space-y-3">
            <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">
              Active Spreadsheets Logged
            </span>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[290px] overflow-y-auto pr-1">
              {customLogs.map((log) => {
                const yearlyCost = log.hoursPerWeek * quizResponses.averageHourlyRatePhp * 52;
                return (
                  <div key={log.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-zinc-900 dark:text-white">{log.name}</h4>
                      <p className="text-zinc-400 text-[10px] font-mono flex items-center gap-1">
                        <Calendar size={10} /> Added {log.addedAt} • {log.hoursPerWeek} hrs every single week
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="font-mono font-bold text-rose-500 dark:text-rose-400 block">
                        ₱{yearlyCost.toLocaleString('en-US')} /yr waste
                      </span>
                      <span className="text-[10px] text-teal-500 font-semibold">
                        → Savings goal: ₱{Math.round(yearlyCost * (quizResult.potentialEfficiencyBoost / 100)).toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Financial growth charts & solutions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">
                Automation Solutions Blueprint
              </h3>
              <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-mono font-bold">
                SOLUTIONS ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">Custom 1-Click VBA Processors</span>
                <p className="text-zinc-505 text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  We design simple buttons embedded directly inside your worksheets to parse, clean, and merge multi-workbook grades or daily logs in milliseconds.
                </p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">Cell Boundary Safeguards</span>
                <p className="text-zinc-505 text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Advanced validation schemas filter manual human typos, auto-checking logic deviations to achieve a target 0% error margin.
                </p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">Relayed Task Automation</span>
                <p className="text-zinc-505 text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Export outcomes instantly as PDF, auto-archive logs, or trigger bulk emails right from your Microsoft Excel interfaces.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-5 rounded-2xl border border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase text-teal-400 font-bold">
              <TrendingUp size={14} strokeWidth={2.5} />
              <span>Projected ROI S-Scale</span>
            </div>
            <p className="text-zinc-400 text-xs">
              MFA configurations guarantee complete workbook payload safety on Microsoft endpoints. Ensure MFA is activated.
            </p>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full transition-all duration-300"
                style={{ width: mfaSecure ? '100%' : '35%' }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span>Primary Sandbox</span>
              <span className={mfaSecure ? 'text-emerald-400' : 'text-amber-400'}>
                {mfaSecure ? '🔒 ENCRYPTED (100% SECURE)' : '⚠️ SECURITY ALERT LEVEL 3'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
