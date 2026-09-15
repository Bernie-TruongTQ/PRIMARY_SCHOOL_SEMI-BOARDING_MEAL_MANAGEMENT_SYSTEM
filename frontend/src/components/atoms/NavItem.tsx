import { type ComponentType } from 'react';

interface NavItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  active?: boolean;
  onClick: () => void;
}

export default function NavItem({ icon: Icon, label, badge, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 relative group',
        active
          ? 'bg-[var(--color-accent-lt)] text-[var(--color-accent-text)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-text-primary)]',
      ].join(' ')}
    >
      {/* Active left-border indicator */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--color-accent)]" />
      )}
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-semibold bg-[var(--color-danger)] text-white rounded-full px-1.5 py-0.5 leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}
