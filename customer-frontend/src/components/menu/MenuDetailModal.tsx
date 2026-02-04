// src/components/menu/MenuDetailModal.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, ToggleButton, ToggleButtonGroup,
  Card, CardContent, IconButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MenuDetail, OptionGroup, SelectedOption } from '@/types';
import { getMenu } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

interface MenuDetailModalProps {
  menuId: number | null;
  onClose: () => void;
}

export default function MenuDetailModal({ menuId, onClose }: MenuDetailModalProps) {
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const { addItem } = useCart();

  useEffect(() => {
    if (menuId) {
      setLoading(true);
      setQuantity(1);
      setSelectedOptions({});
      getMenu(menuId).then(setMenu).finally(() => setLoading(false));
    }
  }, [menuId]);

  const handleSingleSelect = (groupId: number, optionId: number) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: [optionId] }));
  };

  const handleMultiSelect = (groupId: number, optionId: number) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      return { ...prev, [groupId]: current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId] };
    });
  };

  const calculateTotal = () => {
    if (!menu) return 0;
    let total = menu.price;
    menu.option_groups.forEach(group => {
      (selectedOptions[group.id] || []).forEach(optId => {
        const opt = group.options.find(o => o.id === optId);
        if (opt) total += opt.price;
      });
    });
    return total * quantity;
  };

  const canAddToCart = () => menu?.option_groups.filter(g => g.is_required).every(g => (selectedOptions[g.id]?.length || 0) > 0);

  const handleAddToCart = () => {
    if (!menu) return;
    const options: SelectedOption[] = [];
    menu.option_groups.forEach(group => {
      (selectedOptions[group.id] || []).forEach(optId => {
        const opt = group.options.find(o => o.id === optId);
        if (opt) options.push({ optionGroupId: group.id, optionGroupName: group.name, optionId: opt.id, optionName: opt.name, price: opt.price });
      });
    });
    addItem({ menuId: menu.id, menuName: menu.name, menuImage: menu.image_url, basePrice: menu.price, quantity, selectedOptions: options });
    onClose();
  };

  const renderOptionGroup = (group: OptionGroup) => {
    const selected = selectedOptions[group.id] || [];
    if (group.max_select === 1) {
      return (
        <ToggleButtonGroup value={selected[0] || null} exclusive onChange={(_, val) => val && handleSingleSelect(group.id, val)} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {group.options.map(opt => (
            <ToggleButton key={opt.id} value={opt.id} sx={{ borderRadius: '20px', px: 2, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } }}>
              {opt.name}{opt.price > 0 && ` +${opt.price.toLocaleString()}원`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      );
    }
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {group.options.map(opt => (
          <Card key={opt.id} onClick={() => handleMultiSelect(group.id, opt.id)} sx={{ cursor: 'pointer', border: selected.includes(opt.id) ? 2 : 1, borderColor: selected.includes(opt.id) ? 'primary.main' : 'grey.300' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{opt.name}</Typography>
                {selected.includes(opt.id) && <CheckCircleIcon color="primary" fontSize="small" />}
              </Box>
              <Typography variant="caption" color="text.secondary">+{opt.price.toLocaleString()}원</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Dialog open={!!menuId} onClose={onClose} maxWidth="sm" fullWidth>
      {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : menu && (
        <>
          <DialogTitle>{menu.name}</DialogTitle>
          <DialogContent dividers>
            {menu.image_url && <Box component="img" src={menu.image_url} alt={menu.name} sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, mb: 2 }} />}
            <Typography color="text.secondary" sx={{ mb: 2 }}>{menu.description}</Typography>
            <Typography variant="h6" color="primary" sx={{ mb: 3 }}>{menu.price.toLocaleString()}원</Typography>
            {menu.option_groups.map(group => (
              <Box key={group.id} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{group.name} {group.is_required && <span style={{ color: 'red' }}>*필수</span>}</Typography>
                {renderOptionGroup(group)}
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
              <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}><RemoveIcon /></IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={() => setQuantity(q => q + 1)}><AddIcon /></IconButton>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>취소</Button>
            <Button variant="contained" onClick={handleAddToCart} disabled={!canAddToCart()} fullWidth>{calculateTotal().toLocaleString()}원 담기</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
