import React from 'react';

interface LockBannerProps {
  title: string;
  description: string;
}

const LockBanner: React.FC<LockBannerProps> = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--dash-muted)]">Locked</div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-[var(--dash-muted)]">{description}</div>
    </div>
  );
};

export default LockBanner;
