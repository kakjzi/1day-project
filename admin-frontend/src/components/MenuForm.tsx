'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Menu, MenuCreate, MenuUpdate, Category } from '@/types';
import { createMenu, updateMenu, uploadImage } from '@/services/api';

interface MenuFormProps {
  menu: Menu | null;
  categories: Category[];
  storeId: number;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  categories,
  storeId,
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    image_url: '',
    is_available: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!menu;

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        price: menu.price.toString(),
        description: menu.description || '',
        category_id: menu.category_id.toString(),
        image_url: menu.image_url || '',
        is_available: menu.is_available,
      });
      setImagePreview(menu.image_url);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category_id: categories[0]?.id.toString() || '',
        image_url: '',
        is_available: true,
      });
      setImagePreview(null);
    }
    setError(null);
  }, [menu, categories, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: { target: { value: string } }) => {
    setFormData((prev) => ({ ...prev, category_id: event.target.value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_available: e.target.checked }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 검증
    if (file.size > 1024 * 1024) {
      setError('이미지 크기는 1MB 이하여야 합니다');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('JPG, PNG, GIF, WebP 형식만 지원합니다');
      return;
    }

    // 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 업로드
    setUploading(true);
    setError(null);
    try {
      const result = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: result.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // 검증
    if (!formData.name.trim()) {
      setError('메뉴명을 입력하세요');
      return;
    }
    if (!formData.price || parseInt(formData.price) < 0) {
      setError('올바른 가격을 입력하세요');
      return;
    }
    if (!formData.category_id) {
      setError('카테고리를 선택하세요');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit && menu) {
        const updateData: MenuUpdate = {
          name: formData.name,
          price: parseInt(formData.price),
          description: formData.description || undefined,
          category_id: parseInt(formData.category_id),
          image_url: formData.image_url || undefined,
          is_available: formData.is_available,
        };
        await updateMenu(menu.id, updateData);
      } else {
        const createData: MenuCreate = {
          store_id: storeId,
          name: formData.name,
          price: parseInt(formData.price),
          description: formData.description || undefined,
          category_id: parseInt(formData.category_id),
          image_url: formData.image_url || undefined,
        };
        await createMenu(createData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? '메뉴 수정' : '메뉴 등록'}</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="메뉴명"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="가격"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{ inputProps: { min: 0 } }}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={formData.category_id}
            onChange={handleSelectChange}
            label="카테고리"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="설명"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />

        {/* 이미지 업로드 */}
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            이미지 (최대 1MB)
          </Typography>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            disabled={uploading}
          />
          {uploading && (
            <Typography variant="caption" color="primary">
              업로드 중...
            </Typography>
          )}
          {imagePreview && (
            <Box mt={1}>
              <img
                src={imagePreview}
                alt="미리보기"
                style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>

        {isEdit && (
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_available}
                onChange={handleSwitchChange}
              />
            }
            label="판매 가능"
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || uploading}
        >
          {saving ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuForm;
