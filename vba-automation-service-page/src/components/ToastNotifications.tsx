/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Bell, 
  X, 
  TrendingDown, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Cloud,
  Check
} from 'lucide-react';
import { PushNotification } from '../types';

interface ToastNotificationsProps {
  notifications: PushNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export default function ToastNotifications({ notifications, onDismiss, onClearAll }: ToastNotificationsProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full space-y-3 pointer-events-none">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-wider shadow-lg pointer-events-auto">
        <span className="flex items-center gap-1.5">
          <Bell size={12} className="text-teal-400 animate-ping" />
          Active Push Notifications ({notifications.filter(n => !n.isRead).length})
        </span>
        <button 
          onClick={onClearAll}
          className="text-zinc-400 hover:text-white font-semibold cursor-pointer text-[9px]"
        >
          Dismiss All
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pointer-events-auto">
        {notifications.slice(0, 4).map((notif) => (
          <div 
            key={notif.id} 
            className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-805 shadow-xl flex items-start gap-3 relative transition-all duration-300 animate-slideIn"
          >
            {/* Type Icons */}
            <div className="mt-0.5 shrink-0">
              {notif.type === 'save' && (
                <div className="p-1.5 bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 rounded-lg">
                  <TrendingDown size={14} />
                </div>
              )}
              {notif.type === 'transaction' && (
                <div className="p-1.5 bg-blue-500/10 text-blue-650 dark:text-blue-450 rounded-lg">
                  <CreditCard size={14} />
                </div>
              )}
              {notif.type === 'mfa' && (
                <div className="p-1.5 bg-purple-500/10 text-purple-650 dark:text-purple-450 rounded-lg">
                  <ShieldCheck size={14} />
                </div>
              )}
              {notif.type === 'sync' && (
                <div className="p-1.5 bg-teal-500/10 text-teal-650 dark:text-teal-450 rounded-lg">
                  <Cloud size={14} />
                </div>
              )}
              {notif.type === 'system' && (
                <div className="p-1.5 bg-yellow-500/10 text-yellow-650 dark:text-yellow-450 rounded-lg">
                  <Sparkles size={14} />
                </div>
              )}
            </div>

            <div className="space-y-0.5 pr-4">
              <h4 className="font-bold text-xs text-zinc-950 dark:text-white">{notif.title}</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">{notif.message}</p>
              <span className="text-[8px] font-mono text-zinc-400 block mt-1">{notif.timestamp}</span>
            </div>

            <button
              onClick={() => onDismiss(notif.id)}
              className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
