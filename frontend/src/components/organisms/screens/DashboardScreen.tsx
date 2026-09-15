import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  FireIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const KPI_CARDS = [
  {
    label: 'Suất ăn hôm nay',
    value: '461',
    sub: 'Tổng đã xác nhận',
    icon: UserGroupIcon,
    accent: false,
    delta: '+12 so hôm qua',
    up: true,
  },
  {
    label: 'Lớp đã xác nhận',
    value: '18 / 20',
    sub: 'Còn 2 lớp chờ',
    icon: ClipboardDocumentCheckIcon,
    accent: false,
    delta: '90% hoàn thành',
    up: true,
  },
  {
    label: 'Định lượng bếp',
    value: '483 kg',
    sub: 'Nguyên liệu cần chuẩn bị',
    icon: FireIcon,
    accent: false,
    delta: 'Buffer +4.7%',
    up: false,
  },
  {
    label: 'Cảnh báo hệ thống',
    value: '2',
    sub: 'Cần xử lý',
    icon: ExclamationTriangleIcon,
    accent: true,
    delta: '1 khẩn cấp',
    up: false,
  },
];

const MASTER_ACTIONS = [
  {
    title: 'Điểm danh học sinh',
    desc: 'Ghi nhận điểm danh buổi sáng từ giáo viên chủ nhiệm',
    actions: ['Xem trạng thái', 'Cấu hình cutoff'],
    color: '#EBF2FA',
  },
  {
    title: 'Định lượng & Khẩu phần',
    desc: 'Tính toán tổng nguyên liệu cần thiết dựa trên đầu học sinh',
    actions: ['Duyệt định lượng', 'Xuất báo cáo'],
    color: '#DCFCE7',
  },
  {
    title: 'Kế hoạch bếp',
    desc: 'Phân công ca trực, theo dõi nấu nướng theo lô',
    actions: ['Xem ca trực', 'Xác nhận sản lượng'],
    color: '#FEF3C7',
  },
  {
    title: 'Quản trị hệ thống',
    desc: 'Người dùng, lịch bữa ăn, danh mục món ăn',
    actions: ['Cài đặt', 'Quản lý người dùng'],
    color: '#F3E8FF',
  },
];

// Bar chart data: attendance by class
const CLASS_ATTENDANCE = [
  { cls: '1A', pct: 97 }, { cls: '1B', pct: 88 }, { cls: '1C', pct: 100 },
  { cls: '2A', pct: 91 }, { cls: '2B', pct: 85 }, { cls: '2C', pct: 94 },
  { cls: '3A', pct: 100 }, { cls: '3B', pct: 78 }, { cls: '3C', pct: 96 },
  { cls: '4A', pct: 89 }, { cls: '4B', pct: 93 }, { cls: '4C', pct: 87 },
  { cls: '5A', pct: 100 }, { cls: '5B', pct: 82 }, { cls: '5C', pct: 91 },
];

const SYSTEM_ALERTS = [
  {
    type: 'danger' as const,
    title: '2 lớp chưa xác nhận danh sách',
    desc: 'Lớp 3B và 4C còn 8 phút trước cutoff 08:30',
    cta: 'Nhắc nhở',
  },
  {
    type: 'warning' as const,
    title: '3 yêu cầu điều chỉnh khẩn',
    desc: 'Giáo viên yêu cầu thêm/bớt sau cutoff — chờ duyệt',
    cta: 'Xem xét',
  },
];

const RECENT_ACTIVITY = [
  { type: 'Giáo viên', name: 'Phạm Thị Lan', action: 'Xác nhận danh sách 2A', by: 'ptlan@school.edu.vn', time: '08:12' },
  { type: 'Quản lý',   name: 'Trần Quốc Bảo', action: 'Duyệt định lượng bếp', by: 'tqbao@school.edu.vn', time: '08:07' },
  { type: 'Bếp',       name: 'Lê Văn Hùng',   action: 'Bắt đầu ca nấu — Cơm', by: 'lvhung@school.edu.vn', time: '07:55' },
  { type: 'Giáo viên', name: 'Nguyễn Thị Mai', action: 'Báo vắng: Trần Bảo Châu — Lớp 3B', by: 'ntmai@school.edu.vn', time: '07:48' },
  { type: 'Quản trị',  name: 'Hệ thống',       action: 'Tự động khóa cutoff 08:30', by: 'system', time: '08:30' },
  { type: 'Bếp',       name: 'Ngô Thị Hương',  action: 'Xác nhận nhận kho: Thịt heo — 42.3 kg', by: 'nthuong@school.edu.vn', time: '07:30' },
];

const TYPE_COLOR: Record<string, string> = {
  'Giáo viên': 'bg-blue-100 text-blue-700',
  'Quản lý':   'bg-purple-100 text-purple-700',
  'Bếp':       'bg-amber-100 text-amber-700',
  'Quản trị':  'bg-slate-100 text-slate-600',
};

export default function DashboardScreen() {
  return (
    <div className="max-w-[1280px] space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] leading-tight">
            Tổng quan hôm nay
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Bữa trưa — Thứ Ba, 16/09/2025 · Cutoff lúc 08:30
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--color-accent)] rounded-lg text-white hover:bg-[var(--color-accent-hov)] transition-colors">
            <PlusIcon className="w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-[var(--color-border)] rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[var(--color-text-muted)] font-medium">{card.label}</p>
                <div className={`p-1.5 rounded-lg ${card.accent ? 'bg-[var(--color-danger-lt)]' : 'bg-[var(--color-accent-lt)]'}`}>
                  <Icon className={`w-4 h-4 ${card.accent ? 'text-[var(--color-danger)]' : 'text-[var(--color-accent)]'}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none mb-1">
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">{card.sub}</p>
              <p className={`text-[11px] mt-2 font-medium ${card.up ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                {card.delta}
              </p>
            </div>
          );
        })}
      </div>

      {/* Master control panel */}
      <section>
        <h2 className="text-[13px] font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">
          Bảng điều khiển
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MASTER_ACTIONS.map((mod) => (
            <div
              key={mod.title}
              className="bg-white border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: mod.color }}>
                <FireIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{mod.title}</p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">{mod.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {mod.actions.map((act) => (
                  <button
                    key={act}
                    className="text-[11px] px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] transition-colors"
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom: chart + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Attendance bar chart */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
              Điểm danh theo lớp (hôm nay)
            </h2>
            <button className="text-[12px] text-[var(--color-accent)] hover:underline">Chi tiết</button>
          </div>
          <div className="flex items-end gap-2 h-36">
            {CLASS_ATTENDANCE.map((d) => (
              <div key={d.cls} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[9px] text-[var(--color-text-muted)] font-medium">{d.pct}%</span>
                <div className="w-full rounded-t-sm" style={{ height: `${(d.pct / 100) * 112}px`, background: d.pct < 85 ? 'var(--color-warning)' : 'var(--color-accent)', opacity: 0.85 }} />
                <span className="text-[9px] text-[var(--color-text-muted)]">{d.cls}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-4">
            Cảnh báo hệ thống
          </h2>
          <div className="space-y-3">
            {SYSTEM_ALERTS.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-lg p-3 border ${alert.type === 'danger' ? 'border-[var(--color-danger-lt)] bg-[var(--color-danger-lt)]' : 'border-[var(--color-warning-lt)] bg-[var(--color-warning-lt)]'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">{alert.title}</p>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-snug">{alert.desc}</p>
                  </div>
                  <button className={`shrink-0 text-[11px] font-medium px-2 py-1 rounded text-white ${alert.type === 'danger' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'}`}>
                    {alert.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--color-border-soft)] flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[11px] text-[var(--color-text-muted)]">Cutoff 08:30 — còn 6 phút</span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <section className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-soft)]">
          <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Hoạt động gần đây</h2>
          <button className="text-[12px] text-[var(--color-accent)] hover:underline">Xem tất cả</button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[var(--color-border-soft)]">
              {['LOẠI', 'TÊN', 'HÀNH ĐỘNG', 'THỰC HIỆN BỞI', 'GIỜ', ''].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-soft)]">
            {RECENT_ACTIVITY.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--color-border-soft)] transition-colors">
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[row.type] ?? 'bg-slate-100 text-slate-600'}`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium text-[var(--color-text-primary)]">{row.name}</td>
                <td className="px-5 py-3 text-[var(--color-text-secondary)]">{row.action}</td>
                <td className="px-5 py-3 text-[var(--color-text-muted)]">{row.by}</td>
                <td className="px-5 py-3 text-[var(--color-text-muted)] tabular-nums">{row.time}</td>
                <td className="px-5 py-3">
                  <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                    <CheckCircleIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
