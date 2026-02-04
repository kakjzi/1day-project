'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Category, CategoryCreate, CategoryUpdate } from '@/types';
import { createCategory, updateCategory, deleteCategory } from '@/services/api';
import ConfirmDialog from './ConfirmDialog';

interface CategoryManagementProps {
  categories: Category[];
  storeId: number;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  storeId,
  open,
  onClose,
  onRefresh,
}) => {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const data: CategoryCreate = {
        store_id: storeId,
        name: newName.trim(),
        display_order: categories.length + 1,
      };
      await createCategory(data);
      setNewName('');
      setIsAdding(false);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '추가 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editCategory || !newName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const data: CategoryUpdate = { name: newName.trim() };
      await updateCategory(editCategory.id, data);
      setEditCategory(null);
      setNewName('');
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 실패 (메뉴가 있는 카테고리는 삭제할 수 없습니다)');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditCategory(category);
    setNewName(category.name);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditCategory(null);
    setNewName('');
  };

  const cancelEdit = () => {
    setEditCategory(null);
    setIsAdding(false);
    setNewName('');
    setError(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>카테고리 관리</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}

          {/* 추가/수정 폼 */}
          {(isAdding || editCategory) && (
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label={editCategory ? '카테고리명 수정' : '새 카테고리명'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                size="small"
                autoFocus
              />
              <Button
                variant="contained"
                onClick={editCategory ? handleEdit : handleAdd}
                disabled={saving || !newName.trim()}
              >
                {saving ? '...' : editCategory ? '수정' : '추가'}
              </Button>
              <Button onClick={cancelEdit} disabled={saving}>
                취소
              </Button>
            </Box>
          )}

          {/* 카테고리 목록 */}
          <List>
            {categories.map((category) => (
              <ListItem key={category.id}>
                <ListItemText primary={category.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => startEdit(category)}
                    disabled={!!editCategory || isAdding}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => setDeleteTarget(category)}
                    disabled={!!editCategory || isAdding}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              카테고리가 없습니다
            </Typography>
          )}

          {/* 추가 버튼 */}
          {!isAdding && !editCategory && (
            <Button
              startIcon={<AddIcon />}
              onClick={startAdd}
              fullWidth
              sx={{ mt: 1 }}
            >
              카테고리 추가
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="카테고리 삭제"
        message={`'${deleteTarget?.name}' 카테고리를 삭제하시겠습니까? 해당 카테고리에 메뉴가 있으면 삭제할 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </>
  );
};

export default CategoryManagement;
