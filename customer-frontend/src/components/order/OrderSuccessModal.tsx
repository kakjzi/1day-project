// src/components/order/OrderSuccessModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface OrderSuccessModalProps {
  open: boolean;
  orderNumber: string;
  onClose: () => void;
}

export default function OrderSuccessModal({ open, orderNumber, onClose }: OrderSuccessModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!open) { setCountdown(5); return; }
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); onClose(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>주문이 완료되었습니다</Typography>
        <Typography variant="h4" color="primary" sx={{ mb: 2 }}>주문번호: {orderNumber}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{countdown}초 후 자동으로 닫힙니다</Typography>
        <Button variant="contained" onClick={onClose} fullWidth>확인</Button>
      </DialogContent>
    </Dialog>
  );
}
