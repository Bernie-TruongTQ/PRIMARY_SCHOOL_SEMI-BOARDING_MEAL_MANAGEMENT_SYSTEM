type StatusVariant =
  | 'present'
  | 'absent'
  | 'pending'
  | 'confirmed'
  | 'locked'
  | 'cooking'
  | 'ready'
  | 'shortfall'
  | 'matched'
  | 'exceeded'
  | 'approved';

const CONFIG: Record<StatusVariant, { label: string; cls: string }> = {
  present:   { label: 'Có mặt',   cls: 'bg-[var(--color-success-lt)] text-[var(--color-success)]' },
  absent:    { label: 'Vắng',     cls: 'bg-[var(--color-danger-lt)] text-[var(--color-danger)]' },
  pending:   { label: 'Chờ xử lý', cls: 'bg-slate-100 text-slate-500' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-[var(--color-accent-lt)] text-[var(--color-accent-text)]' },
  locked:    { label: 'Đã khóa',  cls: 'bg-slate-800 text-white' },
  cooking:   { label: 'Đang nấu', cls: 'bg-amber-100 text-amber-700' },
  ready:     { label: 'Sẵn sàng', cls: 'bg-[var(--color-success-lt)] text-[var(--color-success)]' },
  shortfall: { label: 'Thiếu hụt', cls: 'bg-[var(--color-warning-lt)] text-[var(--color-warning)]' },
  matched:   { label: 'Đạt',      cls: 'bg-[var(--color-success-lt)] text-[var(--color-success)]' },
  exceeded:  { label: 'Vượt ±3%', cls: 'bg-[var(--color-danger-lt)] text-[var(--color-danger)]' },
  approved:  { label: 'Đã duyệt', cls: 'bg-[var(--color-accent-lt)] text-[var(--color-accent-text)]' },
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string; // override default label
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const { label: defaultLabel, cls } = CONFIG[status];
  const text = label ?? defaultLabel;
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full leading-none',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        cls,
      ].join(' ')}
    >
      {text}
    </span>
  );
}
