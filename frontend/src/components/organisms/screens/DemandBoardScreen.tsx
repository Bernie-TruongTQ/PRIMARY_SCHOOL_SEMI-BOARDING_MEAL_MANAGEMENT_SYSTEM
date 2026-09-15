import { useState } from 'react';
import {
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import StatusBadge from 'components/atoms/StatusBadge';

const CLASSROOM_ROLLUP = [
  { cls: '1A', registered: 30, eating: 27, absent: 3, status: 'confirmed' as const },
  { cls: '1B', registered: 28, eating: 26, absent: 2, status: 'confirmed' as const },
  { cls: '1C', registered: 29, eating: 29, absent: 0, status: 'confirmed' as const },
  { cls: '2A', registered: 31, eating: 28, absent: 3, status: 'confirmed' as const },
  { cls: '2B', registered: 30, eating: 25, absent: 5, status: 'confirmed' as const },
  { cls: '2C', registered: 27, eating: 27, absent: 0, status: 'confirmed' as const },
  { cls: '3A', registered: 32, eating: 31, absent: 1, status: 'confirmed' as const },
  { cls: '3B', registered: 30, eating: 23, absent: 7, status: 'pending' as const },
  { cls: '3C', registered: 29, eating: 28, absent: 1, status: 'confirmed' as const },
  { cls: '4A', registered: 31, eating: 29, absent: 2, status: 'confirmed' as const },
  { cls: '4B', registered: 28, eating: 26, absent: 2, status: 'confirmed' as const },
  { cls: '4C', registered: 30, eating: 24, absent: 6, status: 'pending' as const },
  { cls: '5A', registered: 29, eating: 29, absent: 0, status: 'confirmed' as const },
  { cls: '5B', registered: 31, eating: 26, absent: 5, status: 'confirmed' as const },
  { cls: '5C', registered: 28, eating: 26, absent: 2, status: 'confirmed' as const },
];

const DISHES = [
  { name: 'Cơm trắng',       portion: 200, totalKg: 0, unit: 'kg' },
  { name: 'Thịt kho Tàu',    portion: 120, totalKg: 0, unit: 'kg' },
  { name: 'Canh chua cá',    portion: 180, totalKg: 0, unit: 'lít' },
  { name: 'Rau muống luộc',  portion: 100, totalKg: 0, unit: 'kg' },
  { name: 'Tráng miệng - Chuối', portion: 80, totalKg: 0, unit: 'kg' },
];

export default function DemandBoardScreen() {
  const [buffer, setBuffer] = useState(5);
  const [method, setMethod] = useState<'participation' | 'manual' | 'historical'>('participation');
  const [locked, setLocked] = useState(false);

  const baseHeadcount = CLASSROOM_ROLLUP.reduce((sum, r) => sum + r.eating, 0);
  const finalHeadcount = Math.ceil(baseHeadcount * (1 + buffer / 100));
  const confirmedCount = CLASSROOM_ROLLUP.filter((r) => r.status === 'confirmed').length;

  const dishes = DISHES.map((d) => ({
    ...d,
    totalKg: parseFloat(((finalHeadcount * d.portion) / 1000).toFixed(1)),
  }));

  return (
    <div className="max-w-[1100px] space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Định lượng bữa trưa</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Thứ Ba, 16/09/2025 · {confirmedCount}/15 lớp đã xác nhận
          </p>
        </div>
        {!locked ? (
          <button
            onClick={() => setLocked(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hov)] transition-colors active:scale-[0.98]"
          >
            <LockClosedIcon className="w-4 h-4" />
            Duyệt & Khóa định lượng
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-success-lt)] border border-green-200 rounded-lg">
            <CheckCircleIcon className="w-4 h-4 text-[var(--color-success)]" />
            <span className="text-[13px] font-medium text-[var(--color-success)]">Đã duyệt & khóa — Bếp đã nhận</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* Left: classroom rollup table */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
              Tổng hợp điểm danh theo lớp
            </h2>
            <span className="text-[12px] text-[var(--color-text-muted)]">
              {confirmedCount} / 15 lớp đã xác nhận
            </span>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)]">
                {['LỚP', 'SĨ SỐ', 'ĂN', 'VẮNG', 'TRẠNG THÁI'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-soft)]">
              {CLASSROOM_ROLLUP.map((row) => (
                <tr
                  key={row.cls}
                  className={`transition-colors ${row.status === 'pending' ? 'bg-[var(--color-warning-lt)]' : 'hover:bg-[var(--color-border-soft)]'}`}
                >
                  <td className="px-4 py-2.5 font-semibold text-[var(--color-text-primary)]">{row.cls}</td>
                  <td className="px-4 py-2.5 tabular-nums text-[var(--color-text-secondary)]">{row.registered}</td>
                  <td className="px-4 py-2.5 tabular-nums font-medium text-[var(--color-success)]">{row.eating}</td>
                  <td className="px-4 py-2.5 tabular-nums text-[var(--color-danger)]">{row.absent}</td>
                  <td className="px-4 py-2.5">
                    {row.status === 'pending' ? (
                      <div className="flex items-center gap-1 text-[var(--color-warning)]">
                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Chờ xác nhận</span>
                      </div>
                    ) : (
                      <StatusBadge status="confirmed" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--color-border)] bg-slate-50">
                <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)] text-[13px]">Tổng</td>
                <td className="px-4 py-3 font-semibold tabular-nums text-[13px]">{CLASSROOM_ROLLUP.reduce((s, r) => s + r.registered, 0)}</td>
                <td className="px-4 py-3 font-bold tabular-nums text-[var(--color-success)] text-[13px]">{baseHeadcount}</td>
                <td className="px-4 py-3 font-semibold tabular-nums text-[var(--color-danger)] text-[13px]">{CLASSROOM_ROLLUP.reduce((s, r) => s + r.absent, 0)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Right: controls + dish quantities */}
        <div className="space-y-4">

          {/* Calculation method */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[12px] font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Phương pháp tính
            </p>
            <div className="space-y-2">
              {[
                { id: 'participation', label: 'Theo điểm danh xác nhận' },
                { id: 'manual',        label: 'Nhập thủ công' },
                { id: 'historical',    label: 'Trung bình lịch sử' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value={opt.id}
                    checked={method === opt.id}
                    onChange={() => setMethod(opt.id as typeof method)}
                    className="accent-[var(--color-accent)]"
                    disabled={locked}
                  />
                  <span className="text-[12px] text-[var(--color-text-secondary)]">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[var(--color-text-primary)]">Buffer an toàn</span>
                <span className="text-[13px] font-bold text-[var(--color-accent)] tabular-nums">{buffer}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
                disabled={locked}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-0.5">
                <span>0%</span><span>10%</span>
              </div>
            </div>
          </div>

          {/* Final headcount summary */}
          <div className="bg-[var(--color-accent-lt)] border border-[var(--color-accent)] border-opacity-20 rounded-xl p-4">
            <p className="text-[11px] font-medium text-[var(--color-accent-text)] mb-1">Tổng suất ăn cuối cùng</p>
            <p className="text-4xl font-bold text-[var(--color-accent)] tabular-nums leading-none">{finalHeadcount}</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
              {baseHeadcount} học sinh × (1 + {buffer}%) = {finalHeadcount} suất
            </p>
          </div>

          {/* Dish quantities */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
            <p className="px-4 py-3 border-b border-[var(--color-border-soft)] text-[12px] font-semibold text-[var(--color-text-primary)]">
              Định lượng nguyên liệu
            </p>
            <div className="divide-y divide-[var(--color-border-soft)]">
              {dishes.map((d) => (
                <div key={d.name} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-[12px] font-medium text-[var(--color-text-primary)]">{d.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{d.portion}g/suất</p>
                  </div>
                  <p className="text-[14px] font-bold text-[var(--color-text-primary)] tabular-nums">
                    {d.totalKg} <span className="text-[11px] font-normal text-[var(--color-text-muted)]">{d.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
