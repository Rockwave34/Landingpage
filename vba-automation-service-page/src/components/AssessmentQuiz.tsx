/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  Clock, 
  Users, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { QuizResponses, AssessmentResult } from '../types';

interface AssessmentQuizProps {
  onAssessmentComplete: (result: AssessmentResult, responses: QuizResponses) => void;
  savedResponses?: QuizResponses | null;
}

export default function AssessmentQuiz({ onAssessmentComplete, savedResponses }: AssessmentQuizProps) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'business' | 'school'>(savedResponses?.role || 'business');
  const [excelUsage, setExcelUsage] = useState<string>(savedResponses?.excelUsageFrequency || 'Daily (4+ hours)');
  const [manualHours, setManualHours] = useState<number>(savedResponses?.manualHoursPerWeek || 10);
  const [teamSize, setTeamSize] = useState<number>(savedResponses?.teamSize || 3);
  const [hourlyRate, setHourlyRate] = useState<number>(savedResponses?.averageHourlyRatePhp || 250);
  const [bottleneck, setBottleneck] = useState<string>(savedResponses?.primaryBottleneck || 'Repetitive copy-pasting');
  const [emailContact, setEmailContact] = useState<string>(savedResponses?.emailContact || '');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Live calculator calculation for sidebar to keep interest
  const calculatedWeeklyHours = manualHours * teamSize;
  const calculatedWeeklyCostPhp = calculatedWeeklyHours * hourlyRate;
  const calculatedYearlyCostPhp = calculatedWeeklyCostPhp * 52;

  const nextStep = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!emailContact || !emailContact.includes('@')) {
      alert('Please enter a valid email address to secure your customized report.');
      return;
    }

    const weeklyHoursWasted = manualHours * teamSize;
    const yearlyHoursWasted = weeklyHoursWasted * 52;
    const weeklyCostWastedPhp = weeklyHoursWasted * hourlyRate;
    const yearlyCostWastedPhp = weeklyCostWastedPhp * 52;
    const potentialEfficiencyBoost = 92; // VBA typically saves 90-95% of manual spreadsheets manipulation time

    const simulatedYearlySavingsPhp = Math.round(yearlyCostWastedPhp * (potentialEfficiencyBoost / 100));
    const paybackPeriodDays = Math.round((75000 / weeklyCostWastedPhp) * 7) || 12; // estimated low package price 75k PHP

    let complexityLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (weeklyHoursWasted > 50 || teamSize > 10) {
      complexityLevel = 'High';
    } else if (weeklyHoursWasted > 15 || teamSize > 3) {
      complexityLevel = 'Medium';
    }

    let recommendedPackage = 'School/Small Biz Dashboard Package';
    if (complexityLevel === 'High') {
      recommendedPackage = 'Enterprise VBA Automation Framework';
    } else if (role === 'school' && complexityLevel === 'Low') {
      recommendedPackage = 'Academic Sheet Optimizer Plan';
    } else if (complexityLevel === 'Low') {
      recommendedPackage = 'Express Automated Report Module';
    }

    const specificSuggestions = [
      `Automate the "${bottleneck}" process directly into a single 1-click button.`,
      `Reduce manual labor from ${weeklyHoursWasted} hours/week to less than ${Math.round(weeklyHoursWasted * 0.08)} hours/week.`,
      role === 'school' 
        ? 'Establish clean academic progress tracker with auto-generated grade reports.'
        : 'Connect siloed Excel files to feed directly into a centralized executive dashboard.',
      role === 'business'
        ? 'Deploy safe VBA macro file templates with strict input validation to prevent user mistakes.'
        : 'Speed up administrative student profiles lookup & enrollment logs creation processes.'
    ];

    const result: AssessmentResult = {
      role,
      weeklyHoursWasted,
      yearlyHoursWasted,
      weeklyCostWastedPhp,
      yearlyCostWastedPhp,
      potentialEfficiencyBoost,
      simulatedYearlySavingsPhp,
      paybackPeriodDays: isFinite(paybackPeriodDays) ? paybackPeriodDays : 14,
      complexityLevel,
      recommendedPackage,
      specificSuggestions
    };

    const responses: QuizResponses = {
      role,
      excelUsageFrequency: excelUsage,
      manualHoursPerWeek: manualHours,
      teamSize,
      averageHourlyRatePhp: hourlyRate,
      primaryBottleneck: bottleneck,
      emailContact
    };

    setHasSubmitted(true);
    setTimeout(() => {
      onAssessmentComplete(result, responses);
    }, 600);
  };

  return (
    <div id="assessment-quiz-section" className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 max-w-5xl mx-auto">
      {/* Top Progress bar and Header */}
      <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-1">
              <Zap size={12} className="text-teal-500 animate-pulse" />
              Coursiv-Style Assessment Core
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white">
              VBA Efficiency & Waste Audit
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Find out exactly how much PHP error-prone manual spreadsheet operations cost your educational institution or company.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded">
              STEP {step} OF 7
            </span>
            <div className="w-32 bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 hover:bg-teal-400 h-full transition-all duration-300"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Core Quiz Body */}
        <div className="lg:col-span-8 p-6 md:p-10 bg-white dark:bg-zinc-950/20 flex flex-col justify-between min-h-[420px]">
          <div>
            {/* Step 1: Role check */}
            {step === 1 && (
              <div className="space-y-6">
                <div id="quiz-q1">
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    What is your current occupational setup?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    We adapt the automation formulas to match either corporate KPI processes or educational scheduling metrics.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    id="setup-business-btn"
                    onClick={() => setRole('business')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      role === 'business'
                        ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/20 ring-2 ring-teal-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${role === 'business' ? 'bg-teal-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                      <Building size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white">Business or Corporate</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        SMEs, corporations, startups, finance groups, or professional offices managing spreadsheets.
                      </p>
                    </div>
                  </button>

                  <button
                    id="setup-school-btn"
                    onClick={() => setRole('school')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      role === 'school'
                        ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/20 ring-2 ring-teal-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${role === 'school' ? 'bg-teal-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white">School or Educational</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Universities, grade schools, vocational institutes, student labs, or academic admin desks.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Excel Usage density */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    How often do you or your school team utilize Microsoft Excel spreadsheets?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Frequent spreadsheet manipulation corresponds to compounding compounding savings potential with custom VBA programs.
                  </p>
                </div>
                <div className="space-y-3">
                  {['Daily (4+ hours)', 'Frequently (1-3 hours)', 'Several times a week', 'Rarely or seasonally'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setExcelUsage(option)}
                      className={`flex items-center justify-between w-full p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        excelUsage === option
                          ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/10 font-medium'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${excelUsage === option ? 'border-teal-500' : 'border-zinc-300'}`}>
                          {excelUsage === option && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
                        </span>
                        <span className="text-sm text-zinc-800 dark:text-zinc-200">{option}</span>
                      </div>
                      <FileSpreadsheet className="text-zinc-300 dark:text-zinc-700" size={18} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Manual Hours Per Week */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    How many hours per week does a SINGLE human employee/staff spend on repetitive spreadsheet work?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Repetitive work includes manually moving cells, formatting reports, cleaning CSV imports, or merging multiple workbooks.
                  </p>
                </div>
                <div className="space-y-8 py-4">
                  <div className="flex justify-between items-center bg-teal-500/5 dark:bg-teal-500/10 p-5 rounded-2xl border border-teal-500/20 text-center">
                    <div>
                      <span className="text-3xl md:text-4xl font-black font-sans text-teal-600 dark:text-teal-400">
                        {manualHours}
                      </span>
                      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 ml-1.5">Hours / Week / Person</span>
                    </div>
                    <span className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-800/80 px-2 py-1 rounded bg-white dark:bg-zinc-900 font-mono">
                      ~{(manualHours * 4.3).toFixed(0)} hours a month
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="60"
                      step="1"
                      value={manualHours}
                      onChange={(e) => setManualHours(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>1 hour</span>
                      <span>20 hours</span>
                      <span>40 hours</span>
                      <span>60+ hours</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Team size doing manual work */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    How many people inside your school lab or company desk perform these repetitive tasks?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    VBA scripts are single-file integrated automations that can be shared across unlimited team members instantly.
                  </p>
                </div>
                <div className="space-y-8 py-4">
                  <div className="flex justify-between items-center bg-teal-500/5 dark:bg-teal-500/10 p-5 rounded-2xl border border-teal-500/20 text-center">
                    <div>
                      <span className="text-3xl md:text-4xl font-black font-sans text-teal-600 dark:text-teal-400">
                        {teamSize}
                      </span>
                      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 ml-1.5">Staff Members</span>
                    </div>
                    <span className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-800/80 px-2 py-1 rounded bg-white dark:bg-zinc-900 font-mono">
                      Total {manualHours * teamSize} collective manual hours / week
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>1 person</span>
                      <span>10 people</span>
                      <span>25 people</span>
                      <span>50+ people</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Employee Hourly rate in PHP */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    What is the average hourly salary value (in Philippine Peso) for this resource?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Philippine standard corporate staff rates usually sit around ₱150 - ₱600/hr, while highly skilled data analysts command ₱800+.
                  </p>
                </div>
                <div className="space-y-8 py-4">
                  <div className="flex justify-between items-center bg-teal-500/5 dark:bg-teal-500/10 p-5 rounded-2xl border border-teal-500/20 text-center">
                    <div>
                      <span className="text-3xl md:text-4xl font-black font-sans text-teal-600 dark:text-teal-400">
                        ₱{hourlyRate}
                      </span>
                      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 ml-1.5">PHP per hour</span>
                    </div>
                    <span className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-800/80 px-2 py-1 rounded bg-white dark:bg-zinc-900 font-mono">
                      Monthly budget: ₱{(hourlyRate * manualHours * teamSize * 4.3).toLocaleString('en-US', {maximumFractionDigits: 0})}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>₱50 / hr</span>
                      <span>₱500 / hr</span>
                      <span>₱1,000 / hr</span>
                      <span>₱1,500 / hr</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Core spreadsheet bottleneck */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                    What is your most frustrating bottleneck or error type?
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Excel macros directly solve these major pain points, preventing accidental formula overwrites and streamlining raw source imports.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    'Repetitive copy-pasting from web portals/CSV',
                    'Accidental deletion or overwriting of spreadsheet formulas',
                    'Extremely slow sheets, heavy calculations freezing school/work PC',
                    'Spending hours manually double-checking for human data-entry errors'
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setBottleneck(option)}
                      className={`flex items-center gap-3 w-full p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        bottleneck === option
                          ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/10 font-medium'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${bottleneck === option ? 'border-teal-500' : 'border-zinc-300'}`}>
                        {bottleneck === option && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
                      </span>
                      <span className="text-sm text-zinc-800 dark:text-zinc-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Email Contact to finish and generate report */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Submit Email for Custom VBA Blueprint
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                    We'll load your localized PHP savings audit straight into the real-time analytics dashboard tab. Enter your active email.
                  </p>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                      @
                    </span>
                    <input
                      id="contact-email-input"
                      type="email"
                      required
                      placeholder="e.g. james.esmaya@gmail.com"
                      value={emailContact}
                      onChange={(e) => setEmailContact(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                    <ShieldCheck size={16} className="shrink-0" />
                    <span>Securely stored. No unsolicited marketing. Used purely to lock down your dashboard instance.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Navigation Bar */}
          <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1 || hasSubmitted}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                step === 1 || hasSubmitted
                  ? 'opacity-0 cursor-not-allowed text-zinc-300'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < 7 ? (
              <button
                id="quiz-next-step-btn"
                onClick={nextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl shadow-lg shadow-teal-600/10 transition-all cursor-pointer"
              >
                Proceed <ArrowRight size={16} />
              </button>
            ) : (
              <button
                id="quiz-submit-button"
                onClick={handleComplete}
                disabled={hasSubmitted}
                className="flex items-center gap-1.5 px-7 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-700/80 text-white font-bold rounded-xl shadow-lg shadow-teal-500/15 transition-all cursor-pointer"
              >
                {hasSubmitted ? 'Compiling Metrics...' : 'Generate Dashboard Report'}
                <CheckCircle2 size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Live Calculation Sidebar (Visual Value Proposition) */}
        <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-950/40 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800 font-mono text-zinc-600 dark:text-zinc-400 text-xs">
          <div className="space-y-6">
            <h4 className="text-zinc-900 dark:text-zinc-300 font-bold tracking-tight text-xs uppercase flex items-center justify-between">
              <span>Live Assessment Stats</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Weekly Hours Spent</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-white font-sans">{calculatedWeeklyHours} hrs</p>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded overflow-hidden mt-2">
                  <div className="bg-amber-400 h-full" style={{ width: `${Math.min(calculatedWeeklyHours * 2, 100)}%` }} />
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Weekly Human Wages Cost</span>
                <p id="live-weekly-cost-display" className="text-lg font-bold text-zinc-900 dark:text-white font-sans">
                  ₱{calculatedWeeklyCostPhp.toLocaleString('en-US')}
                </p>
                <span className="text-[10px] text-amber-500 font-sans block mt-1">Paid raw hours of manual clicking</span>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Yearly Inefficient Labor</span>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-sans">
                  ₱{calculatedYearlyCostPhp.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 p-4 rounded-xl mt-6 space-y-2">
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold uppercase text-[10px]">
              <TrendingDown size={14} />
              <span>Typical VBA Impact</span>
            </div>
            <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300">
              VBA macro codes process data up to <strong className="font-semibold">20x faster</strong> with 0% typing typos. Most clients save over <strong className="font-semibold">₱{Math.round(calculatedYearlyCostPhp * 0.92).toLocaleString('en-US')} PHP</strong> every year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
