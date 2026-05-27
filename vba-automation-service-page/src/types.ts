/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'select' | 'input-slider';
  category: 'business' | 'school' | 'general';
  choices?: { label: string; value: string; description?: string; iconName?: string }[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
}

export interface QuizResponses {
  role: 'business' | 'school';
  excelUsageFrequency: string;
  manualHoursPerWeek: number;
  teamSize: number;
  averageHourlyRatePhp: number;
  primaryBottleneck: string;
  emailContact?: string;
}

export interface AssessmentResult {
  role: 'business' | 'school';
  weeklyHoursWasted: number;
  yearlyHoursWasted: number;
  weeklyCostWastedPhp: number;
  yearlyCostWastedPhp: number;
  potentialEfficiencyBoost: number; // percentage (e.g. 90)
  simulatedYearlySavingsPhp: number;
  paybackPeriodDays: number;
  complexityLevel: 'Low' | 'Medium' | 'High';
  recommendedPackage: string;
  specificSuggestions: string[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amountPhp: number;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentMethod: 'GCash' | 'Maya' | 'Card' | 'Bank Transfer';
  referenceNo: string;
}

export interface PushNotification {
  id: string;
  type: 'save' | 'transaction' | 'system' | 'sync' | 'mfa';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface VbaPackage {
  id: string;
  name: string;
  isPopular?: boolean;
  pricePhp: number;
  originalPricePhp: number;
  description: string;
  targetAudience: string;
  features: string[];
}
