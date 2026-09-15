import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import StatusBadge from 'components/atoms/StatusBadge';

interface Student {
  id: string;
  code: string;
  name: string;
  class: string;
  dob: string;
  allergy?: string;
  parent: string;
  phone: string;
  status: 'present' | 'absent';
}

const ALL_STUDENTS: Student[] = [
  { id: '1', code: 'HS-0142', name: 'Nguyễn Bảo Châu',     class: '1A', dob: '12/03/2019', allergy: 'Đậu phộng',  parent: 'Nguyễn Thị Hoa',  phone: '0912 347 182', status: 'present' },
  { id: '2', code: 'HS-0143', name: 'Trần Minh Khôi',       class: '1A', dob: '05/07/2019', allergy: 'Hải sản',    parent: 'Trần Văn Phú',    phone: '0987 214 556', status: 'present' },
  { id: '3', code: 'HS-0144', name: 'Lê Thị Phương Anh',    class: '1A', dob: '22/11/2019',                        parent: 'Lê Quốc Toàn',    phone: '0903 778 214', status: 'absent' },
  { id: '4', code: 'HS-0145', name: 'Phạm Gia Bảo',         class: '1A', dob: '09/01/2019',                        parent: 'Phạm Thị Ngọc',   phone: '0938 661 040', status: 'present' },
  { id: '5', code: 'HS-0146', name: 'Vũ Ngọc Hân',          class: '1A', dob: '14/06/2019', allergy: 'Sữa',        parent: 'Vũ Đình Khải',    phone: '0971 332 897', status: 'present' },
  { id: '6', code: 'HS-0201', name: 'Hoàng Minh Tuấn',      class: '1B', dob: '31/08/2019',                        parent: 'Hoàng Đức Thắng', phone: '0908 554 211', status: 'present' },
  { id: '7', code: 'HS-0202', name: 'Đỗ Khánh Linh',        class: '1B', dob: '19/04/2019',                        parent: 'Đỗ Thị Thu Hà',   phone: '0969 887 432', status: 'present' },
  { id: '8', code: 'HS-0310', name: 'Bùi Thanh Tùng',       class: '2A', dob: '07/10/2018',                        parent: 'Bùi Văn Tân',     phone: '0945 123 789', status: 'absent' },
  { id: '9', code: 'HS-0311', name: 'Ngô Thị Thu Hà',       class: '2A', dob: '24/02/2018', allergy: 'Đậu phộng',  parent: 'Ngô Xuân Long',   phone: '0901 456 234', status: 'present' },
  { id: '10',code: 'HS-0420', name: 'Đinh Quốc Hưng',       class: '2B', dob: '13/09/2018',                        parent: 'Đinh Thị Hằng',   phone: '0932 678 901', status: 'present' },
  { id: '11',code: 'HS-0521', name: 'Lý Mỹ Duyên',          class: '3A', dob: '02/12/2017', allergy: 'Sữa',        parent: 'Lý Thanh Sơn',    phone: '0977 345 678', status: 'present' },
  { id: '12',code: 'HS-0630', name: 'Phan Anh Kiệt',        class: '3B', dob: '28/05/2017',                        parent: 'Phan Thị Lan',    phone: '0968 234 567', status: 'present' },
  { id: '13',code: 'HS-0731', name: 'Trương Thị Lan Anh',   class: '4A', dob: '15/07/2016',                        parent: 'Trương Quang Nam', phone: '0913 890 123', status: 'absent' },
  { id: '14',code: 'HS-0840', name: 'Võ Đức Thịnh',         class: '4C', dob: '03/03/2016',                        parent: 'Võ Thị Kim',      phone: '0956 012 345', status: 'present' },
  { id: '15',code: 'HS-0941', name: 'Mai Hoàng Long',        class: '5A', dob: '21/11/2015', allergy: 'Hải sản',   parent: 'Mai Văn Dũng',    phone: '0923 678 012', status: 'present' },
];

const CLASSES = ['Tất cả', '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C'];

const ALLERGY_COLOR: Record<string, string> = {
  'Hải sản':    'bg-orange-100 text-orange-700',
  'Đậu phộng':  'bg-red-100 text-red-700',
  'Sữa':        'bg-yellow-100 text-yellow-700',
};

export default function StudentDirectoryScreen() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('Tất cả');
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = ALL_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      || s.code.toLowerCase().includes(search.toLowerCase());
    const matchClass  = classFilter === 'Tất cả' || s.class === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div className="max-w-[1280px] space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Học sinh & Lớp học</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Tổng {ALL_STUDENTS.length} học sinh · Năm học 2025–2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)] transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hov)] transition-colors active:scale-[0.98]">
            <PlusIcon className="w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Tìm tên, mã học sinh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-[var(--color-border)] rounded-lg bg-white placeholder-[var(--color-text-muted)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <FunnelIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
          <div className="flex gap-1 flex-wrap">
            {CLASSES.slice(0, 8).map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={[
                  'px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors',
                  classFilter === cls
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-soft)]',
                ].join(' ')}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)]">
                {['MÃ HS', 'HỌ VÀ TÊN', 'LỚP', 'DỊ ỨNG', 'PHỤ HUYNH', 'TRẠNG THÁI', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-soft)]">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`cursor-pointer transition-colors hover:bg-[var(--color-accent-lt)] ${selected?.id === s.id ? 'bg-[var(--color-accent-lt)]' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--color-text-muted)]">{s.code}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                    <div className="flex items-center gap-1.5">
                      {s.allergy && <ExclamationCircleIcon className="w-3.5 h-3.5 text-[var(--color-danger)] shrink-0" />}
                      {s.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[var(--color-accent-text)] bg-[var(--color-accent-lt)] px-2 py-0.5 rounded text-[11px]">
                      {s.class}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.allergy ? (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ALLERGY_COLOR[s.allergy]}`}>
                        {s.allergy}
                      </span>
                    ) : <span className="text-[var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{s.parent}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[12px] text-[var(--color-accent)] hover:underline">Chi tiết</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--color-text-muted)] text-[13px]">
                    Không tìm thấy học sinh nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Slide-over detail panel */}
        {selected && (
          <div className="w-64 shrink-0 bg-white border border-[var(--color-border)] rounded-xl p-5 self-start">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Hồ sơ học sinh</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-0.5 rounded hover:bg-[var(--color-border-soft)] text-[var(--color-text-muted)]"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent-lt)] flex items-center justify-center text-[var(--color-accent-text)] text-base font-bold mb-3">
              {selected.name.split(' ').slice(-1)[0]?.[0]}
            </div>

            <p className="text-base font-semibold text-[var(--color-text-primary)] leading-snug">{selected.name}</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 mb-4">{selected.code} · Lớp {selected.class}</p>

            <div className="space-y-3 text-[12px]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Ngày sinh</p>
                <p className="font-medium text-[var(--color-text-primary)]">{selected.dob}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Dị ứng thực phẩm</p>
                {selected.allergy ? (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ALLERGY_COLOR[selected.allergy]}`}>
                    {selected.allergy}
                  </span>
                ) : (
                  <p className="text-[var(--color-text-muted)]">Không có</p>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Phụ huynh</p>
                <p className="font-medium text-[var(--color-text-primary)]">{selected.parent}</p>
                <p className="text-[var(--color-text-muted)]">{selected.phone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Trạng thái hôm nay</p>
                <StatusBadge status={selected.status} size="md" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--color-border-soft)] space-y-2">
              <button className="w-full px-3 py-1.5 text-[12px] bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hov)] transition-colors">
                Chỉnh sửa hồ sơ
              </button>
              <button className="w-full px-3 py-1.5 text-[12px] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-border-soft)] transition-colors">
                Đổi lớp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
