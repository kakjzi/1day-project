// src/components/menu/MenuCard.tsx

'use client';

import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Menu } from '@/types';

interface MenuCardProps {
  menu: Menu;
  onClick: () => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <Card
      onClick={menu.is_sold_out ? undefined : onClick}
      sx={{
        cursor: menu.is_sold_out ? 'default' : 'pointer',
        opacity: menu.is_sold_out ? 0.6 : 1,
        '&:hover': menu.is_sold_out ? {} : { boxShadow: 4 },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={menu.image_url || '/placeholder.png'}
          alt={menu.name}
          sx={{ objectFit: 'cover' }}
        />
        {menu.is_sold_out && (
          <Chip label="품절" color="error" sx={{ position: 'absolute', top: 8, right: 8 }} />
        )}
      </Box>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>{menu.name}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{menu.description}</Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{menu.price.toLocaleString()}원</Typography>
      </CardContent>
    </Card>
  );
}
