import React from 'react';
import { Badge } from 'reactstrap';

interface AllergenChipProps {
  allergens: string[];
}

export const AllergenChip: React.FC<AllergenChipProps> = ({ allergens }) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div className="d-inline-flex flex-wrap gap-1 align-items-center">
      {allergens.map((item, idx) => (
        <span
          key={idx}
          className="badge rounded-pill px-2 py-1"
          style={{
            fontSize: '11px',
            backgroundColor: '#fff8e6',
            color: '#b45309',
            border: '1px solid #fef3c7',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
};
