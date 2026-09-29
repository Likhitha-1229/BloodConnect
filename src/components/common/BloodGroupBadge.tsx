import React from 'react';
import { BloodGroup } from '../../types';

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = 'md',
  variant = 'subtle',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-xl font-extrabold',
  };

  const variantMap = {
    solid: 'bg-red-700 text-white shadow-xs',
    outline: 'border-2 border-red-700 text-red-700 bg-white shadow-2xs',
    subtle: 'bg-red-50 text-red-800 border border-red-200/80 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl transition-transform ${sizeMap[size]} ${variantMap[variant]}`}
      title={`Blood Group ${group}`}
    >
      {group}
    </div>
  );
};
