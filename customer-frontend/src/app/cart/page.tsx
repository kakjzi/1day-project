// src/app/cart/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, AppBar, Toolbar, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/services/api';
import CartItem from '@/components/cart/CartItem';
import OrderSuccessModal from '@/components/order/OrderSuccessModal';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // 인증 체크 - 임시 비활성화
  // if (!isAuthenticated) { router.push('/login'); return null; }

  const handleOrder = async () => {
    setError('');
    setLoading(true);
    try {
      // Sync cart to backend before ordering
      const { addToCart: syncToBackend, clearServerCart } = await import('@/services/api');
      await clearServerCart(); // Clear any existing cart
      for (const item of items) {
        // Transform to backend CartCreate format
        const backendItem = {
          menu_id: item.menuId,
          quantity: item.quantity,
          options: item.selectedOptions.map(opt => ({
            option_id: opt.optionId,
            name: opt.optionName,
            price: opt.price
          }))
        };
        await syncToBackend(backendItem as any);
      }
      
      const order = await createOrder();
      setOrderNumber(order.display_number);
      clearCart();
    } catch {
      setError('주문에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>장바구니</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">장바구니가 비어있습니다</Typography>
            <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2 }}>메뉴 보기</Button>
          </Box>
        ) : (
          <>
            {items.map(item => <CartItem key={item.id} item={item} />)}
            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">총 결제금액</Typography>
                <Typography variant="h6" color="primary">{totalAmount.toLocaleString()}원</Typography>
              </Box>
              <Button variant="contained" size="large" fullWidth onClick={handleOrder} disabled={loading}>
                {loading ? '주문 중...' : `${totalAmount.toLocaleString()}원 주문하기`}
              </Button>
            </Box>
          </>
        )}
      </Box>
      <OrderSuccessModal open={!!orderNumber} orderNumber={orderNumber || ''} onClose={() => { setOrderNumber(null); router.push('/'); }} />
    </Box>
  );
}
