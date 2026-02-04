// src/components/layout/BottomCartBar.tsx

'use client';

import { Box, Button, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function BottomCartBar() {
  const { totalItems, totalAmount } = useCart();
  const router = useRouter();

  if (totalItems === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'white',
        borderTop: '1px solid #e0e0e0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ShoppingCartIcon color="primary" />
        <Typography>{totalItems}개</Typography>
        <Typography fontWeight="bold">{totalAmount.toLocaleString()}원</Typography>
      </Box>
      <Button variant="contained" size="large" onClick={() => router.push('/cart')}>
        주문하기
      </Button>
    </Box>
  );
}
