import { useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  FireIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import StatusBadge from 'components/atoms/StatusBadge';

type StationStatus = 'pending' | 'cooking' | 'ready';

interface Station {
  id: string;
  name: string;
  targetKg: number;
  unit: string;
  chef: string;
  status: StationStatus;
  batches: number;
}

const INITIAL_STATIONS: Station[] = [
  { id: 'rice',  name: 'Cơm trắng',             targetKg: 92.2, unit: 'kg',  chef: 'Lê Văn Hùng',    status: 'cooking', batches: 2 },
  { id: 'pork',  name: 'Thịt kho Tàu',           targetKg: 55.4, unit: 'kg',  chef: 'Ngô Thị Hương',  status: 'pending', batches: 1 },
  { id: 'soup',  name: 'Canh chua cá bông lau',   targetKg: 83.1, unit: 'lít', chef: 'Trần Quốc Bảo',  status: 'ready',   batches: 3 },
  { id: 'veg',   name: 'Rau muống luộc',          targetKg: 46.1, unit: 'kg',  chef: 'Phan Thị Liên',  status: 'pending', batches: 1 },
  { id: 'fruit', name: 'Chuối tráng miệng',       targetKg: 36.9, unit: 'kg',  chef: 'Đỗ Minh Đức',   status: 'pending', batches: 1 },
];

const STATUS_BADGE_MAP: Record<StationStatus, 'cooking' | 'ready' | 'pending'> = {
  cooking: 'cooking',
  ready:   'ready',
  pending: 'pending',
};

const NEXT_STATUS: Record<StationStatus, StationStatus | null> = {
  pending: 'cooking',
  cooking: 'ready',
  ready:   null,
};

const NEXT_LABEL: Record<StationStatus, string> = {
  pending: 'Bắt đầu nấu',
  cooking: 'Hoàn thành',
  ready:   '',
};

export default function KitchenShiftScreen() {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);

  function advance(id: string) {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== id || !NEXT_STATUS[s.status]) return s;
        return { ...s, status: NEXT_STATUS[s.status]! };
      })
    );
  }

  const readyCount   = stations.filter((s) => s.status === 'ready').length;
  const cookingCount = stations.filter((s) => s.status === 'cooking').length;
  const pendingCount = stations.filter((s) => s.status === 'pending').length;

  return (
    <div className="max-w-[1100px] space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-warning)]">
              Ca trực đang diễn ra
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Bếp ăn — Bữa trưa</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Thứ Ba, 16/09/2025</p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[var(--color-border)] rounded-xl">
          <ClockIcon className="w-4 h-4 text-[var(--color-warning)]" />
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Hạn phục vụ 10:45</p>
            <p className="text-xl font-bold text-[var(--color-warning)] tabular-nums leading-tight">02:17:34</p>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">

        {/* Left — station list */}
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-3 border-b border-[var(--color-border-soft)] flex items-center gap-2">
            <FireIcon className="w-4 h-4 text-[var(--color-warning)]" />
            <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Danh sách bếp</span>
            <span className="ml-auto text-[12px] text-[var(--color-text-muted)]">{stations.length} station</span>
          </div>

          <div className="divide-y divide-[var(--color-border-soft)]">
            {stations.map((s) => (
              <div
                key={s.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${s.status === 'cooking' ? 'bg-[var(--color-warning-lt)]' : 'hover:bg-[var(--color-border-soft)]'}`}
                >
                  {/* Station info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{s.name}</p>
                      <StatusBadge status={STATUS_BADGE_MAP[s.status]} />
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Chef: {s.chef} · {s.batches} lô
                    </p>
                  </div>

                  {/* Target weight */}
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-[var(--color-text-primary)] tabular-nums">{s.targetKg}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{s.unit}</p>
                  </div>

                  {/* Toggle button or done chip */}
                  <div className="shrink-0 w-32">
                    {s.status === 'ready' ? (
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-success-lt)]">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-[var(--color-success)]" />
                        <span className="text-[11px] font-medium text-[var(--color-success)]">Hoàn thành</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => advance(s.id)}
                        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white transition-colors active:scale-[0.97] ${s.status === 'pending' ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hov)]' : 'bg-[var(--color-warning)] hover:opacity-90'}`}
                      >
                        <PlayIcon className="w-3.5 h-3.5" />
                        {NEXT_LABEL[s.status]}
                      </button>
                    )}
                  </div>

                  <ChevronRightIcon className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                </div>
              ))}
          </div>
        </div>

        {/* Right — summary */}
        <div className="space-y-4">

          {/* Meal count */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)] mb-1">Tổng suất ăn hôm nay</p>
            <p className="text-4xl font-bold text-[var(--color-text-primary)] tabular-nums leading-none">461</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Đã xác nhận · Buffer +4.7%</p>
          </div>

          {/* Progress ring-style summary */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
            <p className="text-[12px] font-semibold text-[var(--color-text-primary)] mb-4">Tiến độ bếp</p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-[var(--color-text-muted)]">Hoàn thành</span>
                <span className="font-semibold text-[var(--color-text-primary)] tabular-nums">
                  {readyCount}/{stations.length}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
                <div
                  className="h-full rounded-full bg-[var(--color-success)] transition-all duration-500"
                  style={{ width: `${(readyCount / stations.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Status breakdown */}
            <div className="space-y-2">
              {[
                { label: 'Sẵn sàng',  count: readyCount,   cls: 'bg-[var(--color-success-lt)] text-[var(--color-success)]' },
                { label: 'Đang nấu', count: cookingCount,  cls: 'bg-[var(--color-warning-lt)] text-[var(--color-warning)]' },
                { label: 'Chờ nấu',  count: pendingCount,  cls: 'bg-slate-100 text-slate-500' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--color-text-secondary)]">{row.label}</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${row.cls}`}>
                    {row.count} station
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift info */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
            <p className="text-[12px] font-semibold text-[var(--color-text-primary)] mb-3">Thông tin ca</p>
            <div className="space-y-2 text-[12px]">
              {[
                { label: 'Bắt đầu ca',   value: '07:00' },
                { label: 'Hạn phục vụ', value: '10:45' },
                { label: 'Trưởng ca',    value: 'Lê Văn Hùng' },
                { label: 'Tổng nguyên liệu', value: '314.6 kg' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{item.label}</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
