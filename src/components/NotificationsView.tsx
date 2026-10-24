import React, { useState } from 'react';
import { NotificationItem, Language } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { StatusChip } from './StatusChip';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldCheck, 
  Clock, 
  Check, 
  Filter
} from 'lucide-react';

interface NotificationsViewProps {
  language: Language;
  onSpeak: (text: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  language,
  onSpeak,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'HIGH_RISK'>('ALL');

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'HIGH_RISK') return n.severity === 'HIGH_RISK';
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    onSpeak('All notifications marked as read.');
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-6 h-6 text-[#A6F4C5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                Notifications & Activity Feed
              </h2>
              <span className="text-xs bg-[#F2F4F7] text-[#475467] font-bold px-2 py-0.5 rounded-sm">
                Real-Time Civic Events
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#475467] mt-1">
              Synchronized updates from PFMS, Sachivalayam verification officers, and the Caregiver Suraksha Vault.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="bg-white hover:bg-[#F4F6F8] text-[#172033] border border-[#D0D5DD] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#087F68]" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D0D5DD] pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'ALL' ? 'bg-[#111C2E] text-white' : 'text-[#475467] hover:text-[#111C2E]'
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'UNREAD' ? 'bg-[#111C2E] text-white' : 'text-[#475467] hover:text-[#111C2E]'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilter('HIGH_RISK')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'HIGH_RISK' ? 'bg-[#B42332] text-white' : 'text-[#475467] hover:text-[#B42332]'
          }`}
        >
          High Risk ({notifications.filter(n => n.severity === 'HIGH_RISK').length})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-colors flex flex-col sm:flex-row items-start justify-between gap-3 ${
              !item.read ? 'border-[#D0D5DD] bg-[#FFFFFF] ring-1 ring-[#087F68]/20' : 'border-[#EAECF0] bg-[#FAFBFB]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                item.severity === 'HIGH_RISK' 
                  ? 'bg-[#FEF3F2] text-[#B42332] border border-[#FECDCA]' 
                  : item.severity === 'ATTENTION'
                    ? 'bg-[#FFF4D6] text-[#9A6700] border border-[#FEDF89]'
                    : 'bg-[#E7F4EF] text-[#087F68] border border-[#A6F4C5]'
              }`}>
                {item.severity === 'HIGH_RISK' ? <AlertOctagon className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-[#111C2E] font-heading">
                    {item.title}
                  </h4>
                  <StatusChip 
                    variant={
                      item.severity === 'HIGH_RISK' ? 'high-risk' :
                      item.severity === 'ATTENTION' ? 'attention' : 'completed'
                    }
                    label={item.source}
                  />
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#087F68]"></span>
                  )}
                </div>

                <p className="text-xs text-[#475467] mt-1 leading-relaxed">
                  {item.message}
                </p>

                <div className="text-[11px] text-[#98A2B3] mt-2 font-mono-code">
                  {item.timestamp}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleRead(item.id)}
              className="text-xs text-[#475467] hover:text-[#111C2E] underline shrink-0 cursor-pointer pt-1"
            >
              {item.read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
