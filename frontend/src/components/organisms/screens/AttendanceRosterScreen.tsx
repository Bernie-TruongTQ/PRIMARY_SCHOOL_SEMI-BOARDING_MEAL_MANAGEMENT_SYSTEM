import { useState } from 'react';
import {
  ClockIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import StatusBadge from 'components/atoms/StatusBadge';

const CLASSES = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C'];

interface Student {
  id: string;
  name: string;
  allergy?: string;
  status: 'present' | 'absent';
}

const ROSTER_DATA: Record<string, Student[]> = {
  '1A': [
    { id: 'HS001', name: 'Nguyễn Bảo Châu', status: 'present' },
    { id: 'HS002', name: 'Trần Minh Khôi', allergy: 'Hải sản', status: 'present' },
    { id: 'HS003', name: 'Lê Thị Phương Anh', status: 'absent' },
    { id: 'HS004', name: 'Phạm Gia Bảo', status: 'present' },
    { id: 'HS005', name: 'Vũ Ngọc Hân', allergy: 'Đậu phộng', status: 'present' },
    { id: 'HS006', name: 'Hoàng Minh Tuấn', status: 'present' },
    { id: 'HS007', name: 'Đỗ Khánh Linh', status: 'present' },
    { id: 'HS008', name: 'Bùi Thanh Tùng', status: 'absent' },
    { id: 'HS009', name: 'Ngô Thị Thu Hà', status: 'present' },
    { id: 'HS010', name: 'Đinh Quốc Hưng', status: 'present' },
    { id: 'HS011', name: 'Lý Mỹ Duyên', allergy: 'Sữa', status: 'present' },
    { id: 'HS012', name: 'Phan Anh Kiệt', status: 'present' },
    { id: 'HS013', name: 'Trương Thị Lan Anh', status: 'present' },
    { id: 'HS014', name: 'Võ Đức Thịnh', status: 'absent' },
    { id: 'HS015', name: 'Mai Hoàng Long', status: 'present' },
  ],
  '1B': [
    { id: 'HS020', name: 'Đặng Minh Quân', status: 'present' },
    { id: 'HS021', name: 'Tô Thị Kim Yến', status: 'present' },
    { id: 'HS022', name: 'Cao Bảo Ngọc', allergy: 'Đậu phộng', status: 'absent' },
    { id: 'HS023', name: 'Hồ Thanh Phong', status: 'present' },
    { id: 'HS024', name: 'Lưu Diệu Hiền', status: 'present' },
  ],
};

// Fill remaining classes with placeholder data
CLASSES.forEach((cls) => {
  if (!ROSTER_DATA[cls]) {
    ROSTER_DATA[cls] = [
      { id: `${cls}001`, name: 'Nguyễn Văn An', status: 'present' },
      { id: `${cls}002`, name: 'Trần Thị Bình', status: 'present' },
      { id: `${cls}003`, name: 'Lê Minh Cường', allergy: 'Hải sản', status: 'present' },
      { id: `${cls}004`, name: 'Phạm Thị Dung', status: 'absent' },
      { id: `${cls}005`, name: 'Hoàng Văn Em', status: 'present' },
    ];
  }
});

const ALLERGY_COLOR: Record<string, string> = {
  'Hải sản': 'bg-orange-100 text-orange-700',
  'Đậu phộng': 'bg-red-100 text-red-700',
  'Sữa': 'bg-yellow-100 text-yellow-700',
};

export default function AttendanceRosterScreen() {
  const [activeClass, setActiveClass] = useState('1A');
  const [roster, setRoster] = useState<Record<string, Student[]>>(ROSTER_DATA);
  const [locked, setLocked] = useState(false);

  const students = roster[activeClass] ?? [];
  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount  = students.filter((s) => s.status === 'absent').length;

  function toggle(id: string) {
    if (locked) return;
    setRoster((prev) => ({
      ...prev,
      [activeClass]: prev[activeClass].map((s) =>
        s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
      ),
    }));
  }

  function markAllPresent() {
    if (locked) return;
    setRoster((prev) => ({
      ...prev,
      [activeClass]: prev[activeClass].map((s) => ({ ...s, status: 'present' })),
    }));
  }

  return (
    <div className="max-w-[900px] space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Điểm danh bữa trưa</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Thứ Ba, 16/09/2025 · Bữa trưa
          </p>
        </div>
        {/* Cutoff timer */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-warning-lt)] border border-[var(--color-warning)] border-opacity-30 rounded-lg">
          <ClockIcon className="w-4 h-4 text-[var(--color-warning)]" />
          <div>
            <p className="text-[10px] font-medium text-[var(--color-warning)]">Cutoff lúc 08:30</p>
            <p className="text-base font-bold text-[var(--color-warning)] leading-none tabular-nums">06:14</p>
          </div>
        </div>
      </div>

      {/* Class tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-border)]">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            className={[
              'shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-t-md transition-colors border-b-2',
              activeClass === cls
                ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-lt)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
            ].join(' ')}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Metric header */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sĩ số đăng ký', value: students.length, color: 'text-[var(--color-text-primary)]' },
          { label: 'Ăn hôm nay', value: presentCount, color: 'text-[var(--color-success)]' },
          { label: 'Vắng', value: absentCount, color: 'text-[var(--color-danger)]' },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-[var(--color-border)] rounded-xl px-4 py-3">
            <p className="text-[11px] text-[var(--color-text-muted)]">{m.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {!locked && (
        <div className="flex items-center gap-2">
          <button
            onClick={markAllPresent}
            className="px-3 py-1.5 text-[13px] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] transition-colors"
          >
            Đánh dấu tất cả có mặt
          </button>
          <button
            onClick={() => setLocked(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hov)] transition-colors active:scale-[0.98]"
          >
            <LockClosedIcon className="w-3.5 h-3.5" />
            Xác nhận & Khóa danh sách
          </button>
        </div>
      )}
      {locked && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-success-lt)] border border-[var(--color-success)] border-opacity-30 rounded-lg w-fit">
          <CheckIcon className="w-4 h-4 text-[var(--color-success)]" />
          <span className="text-[13px] font-medium text-[var(--color-success)]">
            Danh sách đã khóa — đã bàn giao bếp
          </span>
        </div>
      )}

      {/* Roster table */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--color-border-soft)]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-8">STT</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Họ và tên</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Dị ứng</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-soft)]">
            {students.map((student, i) => (
              <tr
                key={student.id}
                className={`transition-colors ${!locked ? 'cursor-pointer hover:bg-[var(--color-accent-lt)]' : ''} ${student.status === 'absent' ? 'bg-[var(--color-danger-lt)] bg-opacity-40' : ''}`}
                onClick={() => toggle(student.id)}
              >
                <td className="px-5 py-3 text-[var(--color-text-muted)] tabular-nums text-[12px]">
                  {i + 1}
                </td>
                <td className="px-5 py-3 font-medium text-[var(--color-text-primary)]">
                  <div className="flex items-center gap-2">
                    {student.allergy && (
                      <ExclamationCircleIcon className="w-4 h-4 text-[var(--color-danger)] shrink-0" />
                    )}
                    {student.name}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {student.allergy ? (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ALLERGY_COLOR[student.allergy] ?? 'bg-slate-100 text-slate-600'}`}>
                      {student.allergy}
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {!locked ? (
                    <div className="inline-flex rounded-lg overflow-hidden border border-[var(--color-border)] text-[11px] font-medium">
                      <span
                        className={`px-2.5 py-1 transition-colors ${student.status === 'present' ? 'bg-[var(--color-success)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border-soft)]'}`}
                      >
                        Ăn
                      </span>
                      <span
                        className={`px-2.5 py-1 border-l border-[var(--color-border)] transition-colors ${student.status === 'absent' ? 'bg-[var(--color-danger)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border-soft)]'}`}
                      >
                        Vắng
                      </span>
                    </div>
                  ) : (
                    <StatusBadge status={student.status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
