import React from 'react';
import { Button } from 'reactstrap';

interface BufferStepperProps {
  value: number; // 0 to 10
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export const BufferStepper: React.FC<BufferStepperProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="d-inline-flex align-items-center bg-light border rounded-pill px-3 py-1 shadow-sm">
      <Button
        color="link"
        size="sm"
        className="p-0 text-decoration-none fw-bold text-dark fs-5"
        disabled={disabled || value <= 0}
        onClick={() => onChange(value - 1)}
        style={{ width: '28px', height: '28px', lineHeight: '24px' }}
      >
        -
      </Button>
      <span className="mx-3 fw-bold fs-6 text-primary" style={{ minWidth: '42px', textAlign: 'center' }}>
        +{value}%
      </span>
      <Button
        color="link"
        size="sm"
        className="p-0 text-decoration-none fw-bold text-dark fs-5"
        disabled={disabled || value >= 10}
        onClick={() => onChange(value + 1)}
        style={{ width: '28px', height: '28px', lineHeight: '24px' }}
      >
        +
      </Button>
    </div>
  );
};
