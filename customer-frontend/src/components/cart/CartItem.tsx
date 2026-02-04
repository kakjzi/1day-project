// src/components/cart/CartItem.tsx

'use client';

import { Box, Typography, IconButton, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">{item.menuName}</Typography>
            {item.selectedOptions.length > 0 && (
              <Typography variant="body2" color="text.secondary">{item.selectedOptions.map(o => o.optionName).join(', ')}</Typography>
            )}
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{item.itemTotal.toLocaleString()}원</Typography>
          </Box>
          <IconButton onClick={() => removeItem(item.id)} size="small"><DeleteIcon /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}><RemoveIcon /></IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}><AddIcon /></IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
