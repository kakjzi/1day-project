'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Menu, OptionGroupCreate, OptionCreate } from '@/types';
import { createOptionGroup } from '@/services/api';

interface OptionGroupFormProps {
  menu: Menu | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const OptionGroupForm: React.FC<OptionGroupFormProps> = ({
  menu,
  open,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [maxSelections, setMaxSelections] = useState('1');
  const [options, setOptions] = useState<OptionCreate[]>([]);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;

    setOptions((prev) => [
      ...prev,
      { name: newOptionName.trim(), price: parseInt(newOptionPrice) || 0 },
    ]);
    setNewOptionName('');
    setNewOptionPrice('0');
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!menu) return;

    if (!groupName.trim()) {
      setError('옵션 그룹명을 입력하세요');
      return;
    }

    if (options.length === 0) {
      setError('최소 1개의 옵션을 추가하세요');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const data: OptionGroupCreate = {
        menu_id: menu.id,
        name: groupName.trim(),
        is_required: isRequired,
        max_selections: parseInt(maxSelections) || 1,
        options,
      };
      await createOptionGroup(menu.id, data);
      
      // 초기화
      setGroupName('');
      setIsRequired(false);
      setMaxSelections('1');
      setOptions([]);
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setIsRequired(false);
    setMaxSelections('1');
    setOptions([]);
    setError(null);
    onClose();
  };

  if (!menu) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>옵션 그룹 추가 - {menu.name}</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="옵션 그룹명"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
          placeholder="예: 맵기 선택, 토핑 추가"
          required
        />

        <Box display="flex" gap={2} mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            }
            label="필수 선택"
          />
          <TextField
            label="최대 선택 수"
            type="number"
            value={maxSelections}
            onChange={(e) => setMaxSelections(e.target.value)}
            size="small"
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: 120 }}
          />
        </Box>

        {/* 옵션 추가 */}
        <Box mt={3}>
          <Typography variant="subtitle2" mb={1}>
            옵션 항목
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              label="옵션명"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="추가 가격"
              type="number"
              value={newOptionPrice}
              onChange={(e) => setNewOptionPrice(e.target.value)}
              size="small"
              sx={{ width: 100 }}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <IconButton color="primary" onClick={handleAddOption}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* 옵션 목록 */}
          <List dense>
            {options.map((option, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={option.name}
                  secondary={option.price > 0 ? `+${option.price.toLocaleString()}원` : '추가 금액 없음'}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleRemoveOption(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              옵션을 추가하세요
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptionGroupForm;
