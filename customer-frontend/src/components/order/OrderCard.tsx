// src/components/order/OrderCard.tsx

'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: 'warning' | 'info' | 'primary' | 'success' }> = {
  PENDING: { label: '대기중', color: 'warning' },
  ACCEPTED: { label: '접수됨', color: 'info' },
  PREPARING: { label: '준비중', color: 'primary' },
  COMPLETED: { label: '완료', color: 'success' },
};

export default function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.status];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">주문 #{order.display_number}</Typography>
          <Chip label={status.label} color={status.color} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{new Date(order.created_at).toLocaleString('ko-KR')}</Typography>
        {order.items.map(item => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2">
              {item.menu_name} x {item.quantity}
              {item.options.length > 0 && <Typography component="span" variant="caption" color="text.secondary"> ({item.options.map(o => o.option_name).join(', ')})</Typography>}
            </Typography>
            <Typography variant="body2">{item.subtotal.toLocaleString()}원</Typography>
          </Box>
        ))}
        <Box sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight="bold">총액</Typography>
          <Typography fontWeight="bold" color="primary">{order.total_amount.toLocaleString()}원</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
