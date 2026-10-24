import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  FileEdit 
} from 'lucide-react';

export type StatusVariant = 
  | 'completed'
  | 'pending'
  | 'attention'
  | 'high-risk'
  | 'unknown'
  | 'estimated'
  | 'official'
  | 'user-note';

interface StatusChipProps {
  variant: StatusVariant;
  label?: string;
  source?: string;
  className?: string;
  subtext?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  variant,
  label,
  source,
  className = '',
  subtext,
}) => {
  switch (variant) {
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#087F68] bg-[#E7F4EF] border border-[#A6F4C5] ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#087F68]" />
          <span>{label || 'Completed'}</span>
          {subtext && <span className="text-[10px] font-normal opacity-85">({subtext})</span>}
        </span>
      );

    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#9A6700] bg-[#FFF4D6] border border-[#FEDF89] ${className}`}>
          <Clock className="w-3.5 h-3.5 shrink-0 text-[#9A6700]" />
          <span>{label || 'Pending'}</span>
          {subtext && <span className="text-[10px] font-normal opacity-85">({subtext})</span>}
        </span>
      );

    case 'attention':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#B54708] bg-[#FFFAEB] border border-[#FDB022] ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#B54708]" />
          <span>{label || 'Needs Attention'}</span>
          {subtext && <span className="text-[10px] font-normal opacity-85">({subtext})</span>}
        </span>
      );

    case 'high-risk':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-[#B42332] bg-[#FEF3F2] border border-[#FECDCA] ${className}`}>
          <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-[#B42332]" />
          <span>{label || 'High Risk'}</span>
          {subtext && <span className="text-[10px] font-normal opacity-85">({subtext})</span>}
        </span>
      );

    case 'unknown':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#475467] bg-[#F2F4F7] border border-[#D0D5DD] ${className}`}>
          <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#475467]" />
          <span>{label || 'Needs confirmation'}</span>
        </span>
      );

    case 'estimated':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium italic text-[#344054] bg-[#F9FAFB] border border-[#D0D5DD] ${className}`}>
          <span className="font-bold not-italic text-[#C5A267]">~</span>
          <span>{label || 'Estimated'}</span>
          <span className="not-italic text-[10px] uppercase font-bold text-[#475467] bg-[#EAECF0] px-1 rounded-xs">Estimate</span>
        </span>
      );

    case 'official':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-[#111C2E] bg-[#E7F4EF] border border-[#087F68]/30 ${className}`}>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#087F68]" />
          <span>{label || 'Official'}</span>
          {source && (
            <span className="bg-[#111C2E] text-white text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
              {source}
            </span>
          )}
        </span>
      );

    case 'user-note':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#344054] bg-white border border-dashed border-[#98A2B3] ${className}`}>
          <FileEdit className="w-3.5 h-3.5 shrink-0 text-[#667085]" />
          <span>{label || 'Note'}</span>
          <span className="text-[10px] uppercase font-bold text-[#475467] bg-[#F2F4F7] px-1 rounded-xs">User note</span>
        </span>
      );

    default:
      return null;
  }
};
