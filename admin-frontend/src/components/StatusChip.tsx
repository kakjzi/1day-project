'use client';

import React from 'react';
import { Chip } from '@mui/material';
import { OrderStatus, ORDER_STATUS_CONFIG } from '@/types';

interface StatusChipProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
}

const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 'bold' }}
    />
  );
};

export default StatusChip;
