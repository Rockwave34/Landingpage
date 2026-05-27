/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Mail,
  User,
  Power,
  ShieldCheck
} from 'lucide-react';
import { sendGmailEmail } from '../lib/gmailService';

interface ContactConsultationProps {
  onSuccessBooking?: (dateStr: string, timeSlot: string) => void;
  onToast: (title: string, message: string, type: 'save' | 'transaction' | 'system' | 'sync' | 'mfa') => void;
  gmailUser: any;
  gmailToken: string | null;
  onConnectGmail: () => Promise<string | null>;
}

export default function ContactConsultation({ onToast, gmailUser, gmailToken, onConnectGmail }: ContactConsultationProps) {
  // Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.includes('@')) {
      alert('Please complete the contact form variables.');
      return;
    }
    setContactSubmitting(true);

    try {
      let activeToken = gmailToken;
      if (!activeToken) {
        const connectedToken = await onConnectGmail();
        if (!connectedToken) {
          setContactSubmitting(false);
          return;
        }
        activeToken = connectedToken;
      }

      const htmlBody = `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 600px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff; color: #181c24;">
          <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #0d9488; margin: 0; font-size: 22px;">URGENT VBA Consultation Request</h1>
            <p style="margin: 5px 0 0 0; color: #71717a; font-size: 13px;">Received from VBA Showcase Platform</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f4f4f5;">
              <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7; width: 150px;">Prospect Name:</td>
              <td style="padding: 10px; border: 1px solid #e4e4e7;">${contactName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7;">Prospect Email:</td>
              <td style="padding: 10px; border: 1px solid #e4e4e7;"><a href="mailto:${contactEmail}" style="color: #0d9488; text-decoration: none;">${contactEmail}</a></td>
            </tr>
          </table>

          <div style="background-color: #fafafa; padding: 15px; border-left: 4px solid #0d9488; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #0d9488; font-size: 14px;">Spreadsheet Workflow & Current Situation:</h3>
            <p style="margin: 0; color: #1f2937; white-space: pre-line; font-size: 13px;">${contactMessage}</p>
          </div>

          <div style="font-size: 10px; color: #a1a1aa; border-top: 1px solid #e4e4e7; padding-top: 15px; text-align: center;">
            This dispatch was sent securely using real-time Google Workspace APIs (Gmail API integration).
          </div>
        </div>
      `;

      await sendGmailEmail('james.esmaya@gmail.com', 'URGENT VBA Automation Consultation Request', htmlBody);

      setContactSubmitting(false);
      setContactSubmitted(true);
      onToast(
        'Email Transmitted ✉️',
        `Success! Inquiry was sent using James' connected Gmail account directly to james.esmaya@gmail.com.`,
        'system'
      );
      // reset
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      console.error(err);
      setContactSubmitting(false);
      onToast(
        'Email Failed',
        `Error: ${err.message || 'Check Gmail permissions and try again.'}`,
        'system'
      );
    }
  };

  return (
    <div id="contact-consultation-section" className="scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
          <PhoneCall size={12} className="animate-bounce" />
          Clarification & Support
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-zinc-900 dark:text-white tracking-tight text-center">
          Connect with us!
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-xl mx-auto">
          We turn slow, error-prone manual Excel spreadsheets into safe, automated VBA applications.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Contact form */}
        <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-2xl border border-zinc-200/85 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="space-y-1 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-sans flex items-center justify-center gap-2">
              <Mail size={18} className="text-teal-500" />
              Connect with us!
            </h3>
            <p className="text-xs text-zinc-500 text-center max-w-2xl leading-relaxed">
              Have an intricate educational grades worksheet or complex corporate data entry problems? Submit an inquiry and let's talk!
            </p>
            {gmailUser ? (
              <div className="mt-2 text-[10px] font-mono text-teal-650 dark:text-teal-400 flex items-center gap-1 bg-teal-500/10 px-2.5 py-1 rounded">
                <ShieldCheck size={12} />
                Connected as: {gmailUser.email} (Inquiries will automatically send to james.esmaya@gmail.com)
              </div>
            ) : (
              <div className="mt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded">
                <span>OAuth setup active. Clicking submit will prompt connecting your Gmail account.</span>
              </div>
            )}
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-500/5 text-center border border-emerald-500/10 rounded-2xl space-y-3 animate-scaleUp">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Message Transmitted!</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your parameters are delivered. Our Philippine-based VBA technicians will touch base shortly.
              </p>
              <button
                type="button"
                onClick={() => setContactSubmitted(false)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Send another dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name-input" className="text-[10px] font-semibold text-zinc-500 uppercase">Your Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    placeholder="e.g. James Esmaya"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email-input" className="text-[10px] font-semibold text-zinc-500 uppercase">Your Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-zinc-400 text-xs font-mono">@</span>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="james.esmaya@gmail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-desc-input" className="text-[10px] font-semibold text-zinc-500 uppercase">Description of spreadsheets task</label>
                <textarea
                  id="contact-desc-input"
                  rows={4}
                  required
                  placeholder="Tell us about the Excel spreadsheets, frequency of crashes, formatting pains..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={contactSubmitting}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 font-sans"
              >
                {contactSubmitting ? 'Transmitting...' : 'Submit Inquiry'}
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
