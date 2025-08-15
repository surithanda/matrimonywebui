import React, { ReactNode } from 'react';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const ProfileSection = ({ title, children, className = '' }: ProfileSectionProps) => {
  return (
    <div className={`bg-[#F3F3F3] mt-6 rounded-xl overflow-hidden ${className}`}>
      <h3 className="bg-[#2F3C1F] px-6 py-4 text-white text-xl font-medium">{title}</h3>
      <div className="p-6">{children}</div>
    </div>
  );
};

interface ProfileDetailProps {
  title: string;
  value: string | number | null | undefined;
  colSpan?: number;
  className?: string;
}

export const ProfileDetail = ({ 
  title, 
  value, 
  colSpan = 1,
  className = '' 
}: ProfileDetailProps) => {
  if (value === null || value === undefined) return null;
  
  const colSpanClass = colSpan ? `col-span-${colSpan}` : '';
  
  return (
    <div className={`${colSpanClass} ${className}`}>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-black font-medium mt-1 text-base">
        {value || 'Not specified'}
      </p>
    </div>
  );
};
