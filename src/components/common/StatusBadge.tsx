import React from 'react';
import { RequestStatus, DonorRequestStatus } from '../../types';

interface StatusBadgeProps {
  status: RequestStatus | DonorRequestStatus | 'Available' | 'Unavailable' | 'Active' | 'Suspended' | 'Verified' | 'Pending';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'Available':
    case 'Active':
    case 'Verified':
    case 'Fulfilled':
    case 'Completed':
    case 'Accepted':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;

    case 'Pending Verification':
    case 'Pending':
    case 'Matching':
    case 'New':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-500 animate-pulse';
      break;

    case 'Urgent - Pending Verification':
      colorClasses = 'bg-red-50 text-red-700 border-red-200 font-semibold';
      dotColor = 'bg-red-600 animate-pulse';
      break;

    case 'Donor Contacted':
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
      dotColor = 'bg-sky-500';
      break;

    case 'Unavailable':
    case 'Suspended':
    case 'Declined':
    case 'Cancelled':
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-500';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${sizeClasses} ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
