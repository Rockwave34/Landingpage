/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Check, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessMfa: () => void;
  onToast: (title: string, message: string, type: 'save' | 'transaction' | 'system' | 'sync' | 'mfa') => void;
}

export default function MfaModal({ isOpen, onClose, onSuccessMfa, onToast }: MfaModalProps) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorText('Please enter a valid Philippine mobile number (e.g., 09171234567).');
      return;
    }
    setIsLoading(true);
    setErrorText('');

    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setStep(2);
      onToast('OTP Code Dispatched', `Temporary 6-digit PIN sent to ${phoneNumber}.`, 'mfa');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== '123456' && verificationCode.length !== 6) {
      setErrorText('Incorrect simulated PIN. Enter 123456 for success.');
      return;
    }
    setIsLoading(true);
    setErrorText('');

    setTimeout(() => {
      setIsLoading(false);
      onSuccessMfa();
      onToast(
        'MFA Successfully Activated',
        'Multi-Factor Authentication enabled. Google Authenticator key registered.',
        'mfa'
      );
      setStep(3);
    }, 1500);
  };

  return (
    <div id="mfa-security-modal" className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                Activate Multi-Factor Authenticator
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ensure compliance with corporate security rules. Set up your verification level to encrypt spreadsheets logs.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="mfa-phone-input" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block">
                  Philippine Mobile Number
                </label>
                <input
                  id="mfa-phone-input"
                  type="tel"
                  required
                  placeholder="e.g. 0917 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {errorText && (
                <div className="flex items-center gap-2 p-3 rounded bg-rose-500/5 text-rose-500 text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              <button
                id="mfa-send-otp-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-zinc-400 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                {isLoading ? 'Sending SMS Code...' : 'Send SMS Verification Code'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center">
                <KeyRound size={24} className="animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                Enter Verification digits
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                A mock SMS code is on the way to <strong className="text-zinc-800 dark:text-zinc-200">{phoneNumber}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="mfa-otp-input" className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block">
                  6-Digit Verification PIN Code
                </label>
                <input
                  id="mfa-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 123456 here"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {errorText && (
                <div className="flex items-center gap-2 p-3 rounded bg-rose-500/5 text-rose-500 text-xs">
                  <AlertCircle size={14} className="shrink-0 animate-bounce" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-[10px] p-2 rounded text-center">
                💡 Entering <strong>123456</strong> will trigger a successful mock verification pass.
              </div>

              <button
                id="mfa-verify-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {isLoading ? 'Verifying secure PIN...' : 'Verify Pin & Lock Secure Mode'}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-4 animate-scaleUp">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-pulse">
              <ShieldCheck size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                Unified MFA Configured!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Security clearance upgraded to LEVEL 1. Your real-time local spreadsheet sync profiles are protected.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all w-full cursor-pointer"
            >
              Back to Corporate Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
