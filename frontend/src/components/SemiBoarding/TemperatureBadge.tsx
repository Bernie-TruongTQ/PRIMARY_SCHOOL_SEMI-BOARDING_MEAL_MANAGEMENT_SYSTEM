import React from 'react';
import { Badge } from 'reactstrap';

interface TemperatureBadgeProps {
  temperature: number;
  threshold?: number;
}

export const TemperatureBadge: React.FC<TemperatureBadgeProps> = ({ temperature, threshold = 65 }) => {
  const isPassed = temperature >= threshold;

  return (
    <Badge
      color={isPassed ? 'success' : 'danger'}
      className="badge-pill px-2 py-1 fs-6 align-middle"
      style={{
        backgroundColor: isPassed ? '#e6f4ea' : '#fce8e6',
        color: isPassed ? '#137333' : '#c5221f',
        border: `1px solid ${isPassed ? '#ceead6' : '#fad2cf'}`,
        fontWeight: 600,
      }}
    >
      🌡️ {temperature}°C {isPassed ? '(Đạt chuẩn ≥ 65°C)' : '(Không đạt)'}
    </Badge>
  );
};
