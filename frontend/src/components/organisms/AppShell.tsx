import NavItem from 'components/atoms/NavItem';
import {
  Squares2X2Icon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  FireIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export type PageId =
  | 'dashboard'
  | 'attendance'
  | 'demand'
  | 'kitchen'
  | 'students'
  | 'schedules'
  | 'catalog'
  | 'users';

export type PortalId = 'admin' | 'teacher' | 'manager' | 'kitchen';

interface AppShellProps {
  activePage: PageId;
  activePortal: PortalId;
  onNavigate: (page: PageId) => void;
  onPortalChange: (portal: PortalId) => void;
  children: React.ReactNode;
}

const PORTAL_LABELS: Record<PortalId, string> = {
  admin:   'Quản trị',
  teacher: 'Giáo viên',
  manager: 'Quản lý',
  kitchen: 'Bếp ăn',
};

const PORTAL_NAV: Record<PortalId, { id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[]> = {
  admin: [
    { id: 'dashboard', label: 'Tổng quan',       icon: Squares2X2Icon },
    { id: 'students',  label: 'Học sinh & Lớp',  icon: UserGroupIcon },
    { id: 'schedules', label: 'Lịch bữa ăn',     icon: CalendarDaysIcon },
    { id: 'catalog',   label: 'Thực đơn',         icon: BookOpenIcon },
    { id: 'users',     label: 'Người dùng',       icon: UsersIcon },
  ],
  teacher: [
    { id: 'attendance', label: 'Điểm danh',       icon: ClipboardDocumentCheckIcon },
  ],
  manager: [
    { id: 'demand',    label: 'Định lượng',        icon: ChartBarIcon, badge: 2 },
    { id: 'kitchen',   label: 'Kế hoạch bếp',     icon: FireIcon },
  ],
  kitchen: [
    { id: 'kitchen',   label: 'Ca trực hôm nay',  icon: FireIcon },
  ],
};

export default function AppShell({ activePage, activePortal, onNavigate, onPortalChange, children }: AppShellProps) {
  const navItems = PORTAL_NAV[activePortal] ?? [];

  return (
    <div className="flex w-full min-h-[100dvh]">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className="flex-shrink-0 flex flex-col bg-white border-r border-[var(--color-border)]"
        style={{ width: 'var(--sidebar-w)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-[16px] border-b border-[var(--color-border-soft)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shrink-0">
            <FireIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-700 leading-none text-[var(--color-text-primary)]" style={{ fontWeight: 700 }}>
              BếpSmart
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-none">
              Tiểu học bán trú
            </p>
          </div>
        </div>

        {/* Portal switcher */}
        <div className="px-3 pt-4 pb-2">
          <p className="text-[10px] font-600 uppercase tracking-wider text-[var(--color-text-muted)] mb-2 px-1"
             style={{ fontWeight: 600 }}>
            Cổng thông tin
          </p>
          <div className="space-y-0.5">
            {(Object.keys(PORTAL_LABELS) as PortalId[]).map((pid) => (
              <button
                key={pid}
                onClick={() => onPortalChange(pid)}
                className={[
                  'w-full text-left text-[12px] font-medium px-3 py-1.5 rounded transition-colors',
                  activePortal === pid
                    ? 'bg-[var(--color-accent-lt)] text-[var(--color-accent-text)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)]',
                ].join(' ')}
              >
                {PORTAL_LABELS[pid]}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-3 border-t border-[var(--color-border-soft)] my-2" />

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={activePage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        {/* Bottom user block */}
        <div className="px-3 py-4 border-t border-[var(--color-border-soft)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[12px] font-600 text-slate-600 shrink-0"
                 style={{ fontWeight: 600 }}>
              QL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">Nguyễn Minh Hà</p>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate">{PORTAL_LABELS[activePortal]}</p>
            </div>
            <button className="p-1 rounded hover:bg-[var(--color-border-soft)] text-[var(--color-text-muted)]">
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        {/* Top bar */}
        <header
          className="shrink-0 flex items-center justify-between px-6 bg-white border-b border-[var(--color-border)]"
          style={{ height: 'var(--topbar-h)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-[var(--color-text-muted)]">
              Năm học 2025–2026
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>

          <div className="flex items-center gap-3">
            {/* Date chip */}
            <span className="text-[12px] text-[var(--color-text-muted)] border border-[var(--color-border)] px-2.5 py-1 rounded-full">
              Thứ Ba, 16/09/2025
            </span>
            {/* Bell */}
            <button className="relative p-1.5 rounded-lg hover:bg-[var(--color-border-soft)] text-[var(--color-text-secondary)]">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-danger)]" />
            </button>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[11px] font-600 text-white cursor-pointer"
                 style={{ fontWeight: 600 }}>
              NH
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
