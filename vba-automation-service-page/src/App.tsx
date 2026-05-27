/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  Moon, 
  Sun, 
  TrendingDown, 
  Terminal, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Compass, 
  HelpCircle,
  FileSpreadsheet,
  Zap,
  PhoneCall,
  Lock,
  Workflow,
  Calculator,
  UserCheck,
  Mail,
  LogOut,
  Sparkle
} from 'lucide-react';
import { initAuth, googleSignIn, logout, sendGmailEmail } from './lib/gmailService';
import { User } from 'firebase/auth';

// Subcomponents
import AssessmentQuiz from './components/AssessmentQuiz';
import SavingsCalculator from './components/SavingsCalculator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContactConsultation from './components/ContactConsultation';
import MfaModal from './components/MfaModal';
import ToastNotifications from './components/ToastNotifications';

// Types
import { QuizResponses, AssessmentResult, Transaction, PushNotification, VbaPackage } from './types';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Gmail & OAuth secure states
  const [gmailUser, setGmailUser] = useState<User | null>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(null);

  const handleConnectGmail = async (): Promise<string | null> => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGmailUser(result.user);
        setGmailToken(result.accessToken);
        triggerCustomNotification(
          'Gmail Connected 🟢',
          `Successfully connected to ${result.user.email}. Tests & consultations will route directly to james.esmaya@gmail.com!`,
          'sync'
        );
        return result.accessToken;
      }
      return null;
    } catch (err: any) {
      console.error(err);
      triggerCustomNotification(
        'Connection Canceled',
        err.message || 'Gmail OAuth authorization failed.',
        'system'
      );
      return null;
    }
  };

  const handleGmailLogout = async () => {
    await logout();
    setGmailUser(null);
    setGmailToken(null);
    triggerCustomNotification(
      'Gmail Disconnected 🔴',
      'Gmail session logged out securely.',
      'system'
    );
  };

  // User details state
  const [quizResponses, setQuizResponses] = useState<QuizResponses | null>(null);
  const [quizResult, setQuizResult] = useState<AssessmentResult | null>(null);

  // Active Tab/Section focus
  const [activeTab, setActiveTab] = useState<'home' | 'assessment' | 'calculator' | 'dashboard' | 'pricing' | 'contact'>('home');

  // MFA secure state
  const [isMfaSecure, setIsMfaSecure] = useState<boolean>(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);

  // Push notifications state
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'n1',
      type: 'system',
      title: 'VBA Portal Initialized',
      message: 'Establish standard cost efficiency audits to review Philippine labor loss.',
      timestamp: 'Just now',
      isRead: false
    }
  ]);

  // Simulated Transactions ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 't0',
      date: '2026-05-22',
      description: 'Consultation Deposit - Corporate Excel Audit',
      amountPhp: 0,
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      referenceNo: 'BK-00122-PH'
    }
  ]);

  // Loading states
  const [showQuizBlock, setShowQuizBlock] = useState<boolean>(false);

  // VBA pricing packages in PHP
  const vbaPackages: VbaPackage[] = [
    {
      id: 'pkg-1',
      name: 'Express Macro Integration',
      pricePhp: 25000,
      originalPricePhp: 38000,
      description: 'Automate a single repetitive spreadsheet file bottleneck. Ideal for school score logs or singular departments.',
      targetAudience: 'Schools & Small Projects',
      features: [
        'A single 1-Click VBA custom button automation',
        'Standard input validation patterns to exclude human typos',
        'Direct PDF report printing & sharing routines',
        'Standard Excel legacy compatibility analysis',
        '30 days post-deployment diagnostic warranty'
      ]
    },
    {
      id: 'pkg-2',
      name: 'Dual-Workbook Automation Core',
      isPopular: true,
      pricePhp: 55000,
      originalPricePhp: 110000,
      description: 'Connect dual data input files to feed into a clean structured management dashboard report automatically.',
      targetAudience: 'SMEs & Academic Centers',
      features: [
        'Multi-file cell data transfer & auto-cleaning systems',
        'Centralized custom charts reporting & analytic panel creation',
        'Automatic error check flags highlighting sheet math deviations',
        'Bulk outlook mailing logs system compiled inside macro file',
        'MFA-compliant safety rules encryption',
        'Free automated Enterprise Kanban and Task Manager',
        '90 days expert remote debug assistance'
      ]
    },
    {
      id: 'pkg-3',
      name: 'Multi-System Enterprise Engine',
      pricePhp: 75000,
      originalPricePhp: 150000,
      description: 'Fully integrated automated workflow linking multiple files, custom databases, and automated division mailing queues.',
      targetAudience: 'Corporates & Large Enterprises',
      features: [
        'Unlimited cross-workbook links & data ingestion pipelines',
        'Custom interactive User Forms and advanced secure GUI screens',
        'Automated local database exports (SQL/Access/CSV options)',
        'Built-in secure SHA-256 digital verification locks on macros',
        'Free interactive dashboard customization in analytics board',
        '365 days priority corporate deployment & standby standby support'
      ]
    }
  ];

  // Load from local storage and initialize Gmail auth listener on bootstrap
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGmailUser(user);
        setGmailToken(token);
      },
      () => {
        setGmailUser(null);
        setGmailToken(null);
      }
    );

    const savedResponsesLocal = localStorage.getItem('vba_quiz_responses');
    const savedResultLocal = localStorage.getItem('vba_quiz_result');
    const savedMfaLocal = localStorage.getItem('vba_mfa_secure');
    const savedTransLocal = localStorage.getItem('vba_transactions_list');

    if (savedResponsesLocal && savedResultLocal) {
      try {
        const parsedResponses = JSON.parse(savedResponsesLocal);
        const parsedResult = JSON.parse(savedResultLocal);
        setQuizResponses(parsedResponses);
        setQuizResult(parsedResult);
        setActiveTab('dashboard'); // push directly to portfolio growth tracker
      } catch (err) {
        console.error(err);
      }
    }

    if (savedMfaLocal === 'true') {
      setIsMfaSecure(true);
    }

    if (savedTransLocal) {
      try {
        setTransactions(JSON.parse(savedTransLocal));
      } catch (err) {
        console.error(err);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync state helpers
  const handleQuizSuccess = (result: AssessmentResult, responses: QuizResponses) => {
    setQuizResult(result);
    setQuizResponses(responses);
    setShowQuizBlock(false);
    setActiveTab('dashboard');

    // Save in localStorage representing Cloud sync capability
    localStorage.setItem('vba_quiz_responses', JSON.stringify(responses));
    localStorage.setItem('vba_quiz_result', JSON.stringify(result));

    // Send personalized budget summary alert push
    const welcomePush: PushNotification = {
      id: `n-${Date.now()}`,
      type: 'save',
      title: 'Assessment Generated Successfully! ⚡',
      message: `Your customized report for ${responses.emailContact} is compiled. Potential annual savings: ₱${result.simulatedYearlySavingsPhp.toLocaleString('en-US')} PHP. Check your growth analytics below.`,
      timestamp: 'Just now',
      isRead: false
    };

    setNotifications(prev => [welcomePush, ...prev]);

    // Dispatch Gmail report function
    const sendQuizEmail = async (tokenToUse: string) => {
      try {
        const htmlBody = `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 650px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px;">
              <span style="font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #0d9488; background-color: #ccfbf1; padding: 4px 10px; border-radius: 9999px;">Assessment Report</span>
              <h1 style="color: #0f766e; margin: 10px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">VBA Efficiency & Waste Audit</h1>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">Custom results prepared for <strong>${responses.emailContact}</strong></p>
            </div>
            
            <h3 style="color: #0f766e; font-size: 16px; border-left: 4px solid #0d9488; padding-left: 10px; margin: 20px 0 15px 0;">Audit Profile Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; width: 180px; color: #475569;">Respondent Email:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #0f766e; font-weight: 600;"><a href="mailto:${responses.emailContact}" style="color: #0d9488; text-decoration: none;">${responses.emailContact}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Organizational Focus:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-transform: capitalize; color: #334155;">${responses.role}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Spreadsheets Usage:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #334155;">${responses.excelUsageFrequency}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Manual Labor / Week:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #334155;">${responses.manualHoursPerWeek} hours per employee</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Staff Members Affected:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #334155;">${responses.teamSize} members</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Average Wage PHP Rate:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #334155;">₱${responses.averageHourlyRatePhp} / hr</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 600; border: 1px solid #e2e8f0; color: #475569;">Primary Hurdle:</td>
                <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #e11d48; font-weight: 600;">${responses.primaryBottleneck}</td>
              </tr>
            </table>

            <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
              <span style="font-size: 11px; text-transform: uppercase; color: #0f766e; font-weight: 700; letter-spacing: 0.05em;">Calculated VBA Efficiency Impact</span>
              <h2 style="font-size: 32px; color: #0d9488; margin: 5px 0 10px 0; font-weight: 800;">₱${result.simulatedYearlySavingsPhp.toLocaleString('en-US')} PHP / Year</h2>
              <p style="margin: 0; font-size: 13px; color: #0f766e; leading-relaxed;">
                This represents a <strong>${result.potentialEfficiencyBoost}% reduction</strong> in manual clicker costs, recapturing <strong>${result.yearlyHoursWasted} operational hours</strong> currently wasted on spreadsheet delays.
              </p>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;">
              <h4 style="margin: 0 0 5px 0; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Recommended Solution Framework:</h4>
              <p style="font-weight: 800; font-size: 16px; margin: 0; color: #0f766e;">${result.recommendedPackage}</p>
              <span style="font-size: 12px; color: #64748b; block; margin-top: 5px;">Workplace Complexity: <strong>${result.complexityLevel}</strong> &bull; Estimated ROI: <strong>${result.paybackPeriodDays} days</strong></span>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #0f766e; font-size: 16px; border-left: 4px solid #0d9488; padding-left: 10px; margin: 20px 0 12px 0;">Strategic Action Blueprint</h3>
              <ul style="padding-left: 20px; margin: 0; font-size: 13px; color: #334155; line-height: 1.7;">
                ${result.specificSuggestions.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
              </ul>
            </div>

            <div style="font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; margin-top: 35px; font-family: monospace;">
              Message generated via secure OAuth connections and dispatched using actual Gmail REST API integration.
            </div>
          </div>
        `;

        await sendGmailEmail('james.esmaya@gmail.com', 'VBA Automation Test Result', htmlBody);
        
        triggerCustomNotification(
          'Email Compiled ✉',
          'VBA Efficiency Audit results successfully emailed to james.esmaya@gmail.com.',
          'sync'
        );
      } catch (err: any) {
        console.error(err);
        triggerCustomNotification(
          'Email Pending',
          `Could not send test email automatically. Make sure Gmail permissions are authorized.`,
          'system'
        );
      }
    };

    if (gmailToken) {
      sendQuizEmail(gmailToken);
    } else {
      // Prompt user to connect Gmail account so that report is properly routed
      const triggerConnectAndSend = async () => {
        const token = await handleConnectGmail();
        if (token) {
          sendQuizEmail(token);
        }
      };
      triggerConnectAndSend();
    }
  };

  const handleMfaSuccess = () => {
    setIsMfaSecure(true);
    setIsMfaModalOpen(false);
    localStorage.setItem('vba_mfa_secure', 'true');
  };

  const handlePaymentSuccess = (newTrans: Transaction) => {
    const updatedTransList = [newTrans, ...transactions];
    setTransactions(updatedTransList);
    localStorage.setItem('vba_transactions_list', JSON.stringify(updatedTransList));

    const invoicePush: PushNotification = {
      id: `np-${Date.now()}`,
      type: 'transaction',
      title: 'GCash / Maya Invoice paid! ₱',
      message: `Successful checkout. Assigned reference: ${newTrans.referenceNo}. ₱${newTrans.amountPhp.toLocaleString('en-US')} has been secure sandbox authorized.`,
      timestamp: 'Just now',
      isRead: false
    };

    setNotifications(prev => [invoicePush, ...prev]);
  };

  const triggerCustomNotification = (title: string, message: string, type: 'save' | 'transaction' | 'system' | 'sync' | 'mfa') => {
    const freshPush: PushNotification = {
      id: `n-${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [freshPush, ...prev]);
  };

  // Log a custom task in the issue tracker which influences total metrics
  const handleLogCustomTask = (taskName: string, hours: number) => {
    if (!quizResult || !quizResponses) return;

    // update calculations
    const updatedWeeklyHours = quizResult.weeklyHoursWasted + hours;
    const updatedYearlyHours = updatedWeeklyHours * 52;
    const updatedWeeklyCost = updatedWeeklyHours * quizResponses.averageHourlyRatePhp;
    const updatedYearlyCost = updatedWeeklyCost * 52;
    const updatedSavings = Math.round(updatedYearlyCost * (quizResult.potentialEfficiencyBoost / 100));

    const updatedResult: AssessmentResult = {
      ...quizResult,
      weeklyHoursWasted: updatedWeeklyHours,
      yearlyHoursWasted: updatedYearlyHours,
      weeklyCostWastedPhp: updatedWeeklyCost,
      yearlyCostWastedPhp: updatedYearlyCost,
      simulatedYearlySavingsPhp: updatedSavings
    };

    setQuizResult(updatedResult);
    localStorage.setItem('vba_quiz_result', JSON.stringify(updatedResult));
  };

  const handleResetAssessment = () => {
    if (confirm('Are you sure you want to reset your local assessment variables? This resets temporary configurations.')) {
      localStorage.removeItem('vba_quiz_responses');
      localStorage.removeItem('vba_quiz_result');
      localStorage.removeItem('vba_mfa_secure');
      setQuizResponses(null);
      setQuizResult(null);
      setIsMfaSecure(false);
      setShowQuizBlock(true);
      setActiveTab('assessment');
      triggerCustomNotification('Assessment Reset', 'Temporary localized cache cleared. Ready to reload your efficiency parameters.', 'system');
    }
  };

  const handleConsultationSuccess = (day: string, slot: string) => {
    // Add completed calendar block indicator placeholder or insert a transaction
    const virtualMeetingTrans: Transaction = {
      id: `tm-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      description: `Free consultation scheduled: ${day} at ${slot}`,
      amountPhp: 0,
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
      referenceNo: `MEET-${Math.floor(100 + Math.random() * 900)}`
    };
    setTransactions(prev => [virtualMeetingTrans, ...prev]);
  };

  // Scroll to section for clean SPA navigation
  const handleNavScroll = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'assessment') {
      setShowQuizBlock(true);
      setTimeout(() => {
        document.getElementById('assessment-quiz-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setTimeout(() => {
        let elId = '';
        if (tab === 'home') elId = 'root';
        else if (tab === 'calculator') elId = 'savings-calculator-section';
        else if (tab === 'dashboard') elId = 'analytics-dashboard-tab';
        else if (tab === 'pricing') elId = 'payment-gateway-section';
        else if (tab === 'contact') elId = 'contact-consultation-section';

        document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className={isDarkMode ? 'dark min-h-screen bg-zinc-950 text-zinc-105 selection:bg-teal-500/30 font-sans' : 'min-h-screen bg-zinc-50 text-zinc-900 selection:bg-teal-500/20 font-sans'}>
      
      {/* Visual Header / Navigation Bar */}
      <nav id="vba-navigation-header" className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => handleNavScroll('home')}
            className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-all"
          >
            <div className="p-2 bg-teal-600 rounded-xl text-white shadow-md shadow-teal-500/20">
              <Terminal size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span id="header-brand-title" className="font-extrabold text-base md:text-lg tracking-tight font-sans text-zinc-950 dark:text-white">
                VBA Automation Service Page
              </span>
              <span className="block text-[9px] font-mono text-teal-600 dark:text-teal-400 font-bold tracking-widest leading-none">
                VBA Automation and Workflow Optimization
              </span>
            </div>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-zinc-650 dark:text-zinc-400">
            <button onClick={() => handleNavScroll('calculator')} className="hover:text-teal-500 transition-all cursor-pointer">Calculator</button>
            {quizResult && (
              <button onClick={() => handleNavScroll('dashboard')} className="hover:text-teal-500 transition-all cursor-pointer flex items-center gap-1">
                Dashboard <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </button>
            )}
            <button onClick={() => handleNavScroll('contact')} className="hover:text-teal-500 transition-all cursor-pointer">Support Form</button>
          </div>

          {/* Right Toolbar Utilities */}
          <div className="flex items-center gap-3">
            {/* Gmail Connection Status Button */}
            {gmailUser ? (
              <div className="flex items-center gap-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold select-none">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline truncate max-w-[120px]" title={gmailUser.email || undefined}>{gmailUser.email}</span>
                <button 
                  onClick={handleGmailLogout} 
                  title="Disconnect Gmail Account"
                  className="hover:text-rose-500 hover:dark:text-rose-400 transition-colors p-0.5"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGmail}
                title="Connect Gmail Account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-805 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-all text-xs font-semibold"
              >
                <Mail size={13} className="text-teal-500" />
                <span className="hidden sm:inline">Connect Gmail</span>
              </button>
            )}

            {/* Dark Mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-805 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-all"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {quizResult ? (
              <div className="flex items-center gap-2">
                <button
                  id="header-audit-reset-btn"
                  onClick={handleResetAssessment}
                  className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                  Reset Audit
                </button>
              </div>
            ) : (
              <button
                id="header-start-audit-btn"
                onClick={() => {
                  setShowQuizBlock(true);
                  handleNavScroll('assessment');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/10 cursor-pointer transition-all flex items-center gap-1.5"
              >
                Start Free Audit <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-24">
        
        {/* VIEW 1: PRE-AUDIT INTRO HERO SECTION (Only displayed or configured initially) */}
        {!quizResult && !showQuizBlock && (
          <div className="space-y-12">
            <div id="hero-marketing-panel" className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 p-8 md:p-14 shadow-2xl space-y-12 animate-fadeIn">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-36 -mt-36" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-36 -mb-36" />

              <div className="relative text-center max-w-3xl mx-auto space-y-12">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest rounded-full">
                    <Workflow size={12} className="text-amber-500 animate-spin" />
                    We automate repetitive Excel tasks into fast, reliable VBA systems tailored to your workflow.
                  </span>
                </div>
                
                <h1 id="hero-marketing-title" className="text-4xl md:text-6xl font-extrabold font-sans text-zinc-950 dark:text-white tracking-tight leading-none">
                  Stop Doing Spreadsheet Work Manually!
                </h1>
                
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                  Reduce manual data entry by up to 95% for academic and corporate reporting — no complex setup required.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-5 pt-6">
                  <button
                    id="hero-talk-to-me-btn"
                    onClick={() => handleNavScroll('contact')}
                    className="w-full md:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/15 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    Talk to me
                  </button>

                  <button
                    id="hero-quiz-cta-primary"
                    onClick={() => {
                      setShowQuizBlock(true);
                      handleNavScroll('assessment');
                    }}
                    className="w-full md:w-auto px-6 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-900 dark:text-white font-bold text-sm rounded-xl border border-zinc-200 dark:border-zinc-805 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Take the test!
                    <ArrowRight size={16} />
                  </button>
                  
                  <button
                    id="hero-calc-cta-secondary"
                    onClick={() => handleNavScroll('calculator')}
                    className="w-full md:w-auto px-6 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-900 dark:text-white font-bold text-sm rounded-xl border border-zinc-200 dark:border-zinc-805 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calculator size={15} /> Simulate savings
                  </button>
                </div>
              </div>

              {/* Core KPI metrics bento bar */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-150 dark:border-zinc-850">
                <div className="text-center md:text-left space-y-1">
                  <strong className="text-3xl md:text-4xl font-extrabold font-mono text-rose-500">
                    ₱75,000+
                  </strong>
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest leading-none mt-1">
                    Average Yearly Labor Waved per Desk
                  </h4>
                  <p className="text-[11px] text-zinc-400">Computed on the standard ₱250 hour rate.</p>
                </div>

                <div className="text-center md:text-left space-y-1">
                  <strong className="text-3xl md:text-4xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                    20x Faster
                  </strong>
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest leading-none mt-1">
                    Calculation speed productivity
                  </h4>
                  <p className="text-[11px] text-zinc-400">Dramatically speeds up slow spreadsheets and pivots.</p>
                </div>

                <div className="text-center md:text-left space-y-1">
                  <strong className="text-3xl md:text-4xl font-extrabold font-mono text-sky-500">
                    0% Mistype Rate
                  </strong>
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest leading-none mt-1">
                    Absolute typing accuracy
                  </h4>
                  <p className="text-[11px] text-zinc-400">Strict Excel cells boundary controls lock formula safety.</p>
                </div>
              </div>
            </div>

            {/* VBA Cost Efficiency Promise Callout Banner */}
            <div className="bg-teal-50/50 dark:bg-teal-950/10 border border-teal-500/20 p-8 rounded-3xl space-y-4 max-w-4xl mx-auto shadow-xl animate-fadeIn">
              <div className="flex flex-col md:flex-row gap-5 items-center md:items-start text-center md:text-left">
                <div className="p-3 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-2xl shrink-0">
                  <ShieldCheck size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-zinc-950 dark:text-white text-xl md:text-2xl font-sans tracking-tight">
                    VBA Cost Efficiency Promise
                  </h3>
                  <p className="text-sm md:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed font-sans">
                    Unlike software-as-a-service (SaaS) which hooks you with forever recurring monthly user subscriptions, Microsoft Excel macros run locally under your current Microsoft Office licenses. <strong className="font-semibold text-zinc-900 dark:text-white">Zero recurring platform fees. Always yours. Always secure.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: COURSIV-STYLE ASSESSMENT QUIZ BLOCK (Renders when showQuizBlock or during active quiz) */}
        {showQuizBlock && (
          <div className="space-y-6">
            <AssessmentQuiz 
              onAssessmentComplete={handleQuizSuccess} 
              savedResponses={quizResponses}
            />
            <div className="text-center">
              <button
                id="quit-quiz-survey-btn"
                onClick={() => {
                  setShowQuizBlock(false);
                  setActiveTab('home');
                }}
                className="text-xs text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 underline"
              >
                Quit Assessment & View Marketing Pages Instead
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: USER COMPLETED AUDIT CARD PANEL (Displayed at top when quiz finished) */}
        {quizResult && quizResponses && !showQuizBlock && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-scaleUp">
            <div className="flex gap-4 items-start text-left">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <UserCheck size={28} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold bg-emerald-500 text-white rounded px-1.5 py-0.5 uppercase tracking-widest inline-block">
                  Audit Completed Securely
                </span>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white font-sans">
                  ₱{quizResult.simulatedYearlySavingsPhp.toLocaleString('en-US')} PHP Potential Yearly Retrenchment Found
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  We located approximately <strong className="font-semibold">{quizResult.weeklyHoursWasted} tedious click-drag hours</strong> wasted per week across <strong className="font-semibold">{quizResponses.teamSize} personnel</strong>. Target package recommended: <strong className="text-teal-600 dark:text-teal-400 font-semibold">{quizResult.recommendedPackage}</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                id="jump-to-dashboard-btn"
                onClick={() => handleNavScroll('dashboard')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-505 bg-teal-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
              >
                Go to Live Growth Tracker
              </button>
              <button
                id="trigger-quiz-redo-btn"
                onClick={() => {
                  setShowQuizBlock(true);
                  handleNavScroll('assessment');
                }}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer transition-all"
              >
                Change Audit Parameters
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: SIMULATION CALCULATOR */}
        <SavingsCalculator 
          initialHourlyRate={quizResponses?.averageHourlyRatePhp}
          initialHoursPerWeek={quizResponses?.manualHoursPerWeek}
          initialTeamSize={quizResponses?.teamSize}
          onCtaClick={() => handleNavScroll('contact')}
        />

        {/* VIEW 5: PORTFOLIO GROWTH TRACKER ANALYTICS DASHBOARD */}
        {quizResult && quizResponses && (
          <AnalyticsDashboard 
            quizResult={quizResult}
            quizResponses={quizResponses}
            transactions={transactions}
            mfaSecure={isMfaSecure}
            onMfaToggleClick={() => setIsMfaModalOpen(true)}
            onAddLog={handleLogCustomTask}
            onToastRequest={triggerCustomNotification}
          />
        )}

        {/* VIEW 7: CONTACT FORM AND SCHEDULER */}
        <ContactConsultation 
          onSuccessBooking={handleConsultationSuccess}
          onToast={triggerCustomNotification}
          gmailUser={gmailUser}
          gmailToken={gmailToken}
          onConnectGmail={handleConnectGmail}
        />

        {/* COMPREHENSIVE HELPFUL FAQ ACCORDION SECTION */}
        <div id="vba-faq-section" className="space-y-6 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Answers & Security Compliance</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4 divide-y divide-zinc-200 dark:divide-zinc-805">
            <div className="space-y-2 pt-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-teal-500" />
                Are VBA macro scripts secure to run on standard educational and business laptops?
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6">
                Yes absolutely. Microsoft Office VBA executes directly inside Excel memory frameworks beneath sandbox policies. We incorporate clean local digital signatures within macro assemblies ensuring that Windows security policies grant verification passes smoothly without blocking administrative restrictions.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-teal-500" />
                How work packages are priced, and what are the payment terms?
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6">
                Payment terms will be discussed during the discovery call and consultation. We adapt modern pricing models suitable for schools, SMEs, and corporate workflows based on complexity of scope and requested integrations.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-teal-500" />
                Do VBA macros support multi-user shared workbooks over Cloud solutions (e.g. OneDrive / Sharepoint)?
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6">
                Yes. We design our automation scripts to fully support co-authoring and multi-user shared workbooks across OneDrive and SharePoint. Our systems include custom synchronization routines that avoid file lock exceptions and formula conflicts, ensuring academic administrators and divisional departments can collaborate smoothly in real time.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Visual Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <Terminal size={14} />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-950 dark:text-white block">VBA Automation and Workflow Optimization</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">With great tools come great productivity!</span>
            </div>
          </div>

          <div className="flex gap-4 font-mono text-[10px] text-zinc-400 font-medium">
            <span>TLS 1.3 SECURE ENCRYPTED</span>
            <span>•</span>
            <span>LOCAL DATA SAFEGUARDED</span>
          </div>
        </div>
      </footer>

      {/* Security MFA Trigger Popup Modal */}
      <MfaModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
        onSuccessMfa={handleMfaSuccess}
        onToast={triggerCustomNotification}
      />

      {/* Floating Push notifications drawer alerts */}
      <ToastNotifications 
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onClearAll={() => setNotifications([])}
      />

    </div>
  );
}
