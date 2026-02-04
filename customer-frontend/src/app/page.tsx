// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Tabs, Tab, Typography, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getMenus } from '@/services/api';
import { Menu, Category } from '@/types';
import MenuCard from '@/components/menu/MenuCard';
import MenuDetailModal from '@/components/menu/MenuDetailModal';
import BottomCartBar from '@/components/layout/BottomCartBar';

export default function MenuPage() {
  const { isAuthenticated, tableNumber, loading: authLoading } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // if (isAuthenticated) {
      getMenus(1).then(data => {
        setMenus(data);
        const cats = Array.from(new Map(data.map(m => [m.category_id, { id: m.category_id, name: m.category_name }])).values());
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      }).catch(err => {
        console.error('메뉴 로드 실패:', err);
      }).finally(() => setLoading(false));
    // }
  }, [isAuthenticated]);

  if (authLoading || loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;

  const filteredMenus = selectedCategory ? menus.filter(m => m.category_id === selectedCategory) : menus;

  return (
    <Box sx={{ pb: totalItems > 0 ? 10 : 0 }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>테이블 {tableNumber}</Typography>
          <IconButton onClick={() => router.push('/cart')}><ShoppingCartIcon /></IconButton>
          <IconButton onClick={() => router.push('/orders')}><ReceiptIcon /></IconButton>
        </Toolbar>
        <Tabs value={selectedCategory} onChange={(_, val) => setSelectedCategory(val)} variant="scrollable" scrollButtons="auto" sx={{ bgcolor: 'white' }}>
          {categories.map(cat => <Tab key={cat.id} label={cat.name} value={cat.id} />)}
        </Tabs>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {filteredMenus.map(menu => <MenuCard key={menu.id} menu={menu} onClick={() => setSelectedMenuId(menu.id)} />)}
        </Box>
      </Box>
      <MenuDetailModal menuId={selectedMenuId} onClose={() => setSelectedMenuId(null)} />
      <BottomCartBar />
    </Box>
  );
}
