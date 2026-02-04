// src/app/orders/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders } from '@/services/api';
import { Order } from '@/types';
import OrderCard from '@/components/order/OrderCard';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 인증 체크
    if (!isAuthenticated) { router.push('/login'); return; }
    getOrders().then(setOrders).catch(err => {
      console.error('주문 로드 실패:', err);
    }).finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>주문내역</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><Typography color="text.secondary">주문내역이 없습니다</Typography></Box>
        ) : (
          orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </Box>
    </Box>
  );
}
