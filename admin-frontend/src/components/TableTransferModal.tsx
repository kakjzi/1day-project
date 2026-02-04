'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { TableWithOrders } from '@/types';
import { transferOrders } from '@/services/api';
import ConfirmDialog from './ConfirmDialog';

interface TableTransferModalProps {
  sourceTable: TableWithOrders | null;
  tables: TableWithOrders[];
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const TableTransferModal: React.FC<TableTransferModalProps> = ({
  sourceTable,
  tables,
  open,
  onClose,
  onRefresh,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<TableWithOrders | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableTables = tables.filter((t) => t.id !== sourceTable?.id);

  const handleSelect = (table: TableWithOrders) => {
    setSelectedTarget(table);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!sourceTable || !selectedTarget) return;

    setLoading(true);
    try {
      await transferOrders(sourceTable.id, selectedTarget.id);
      setConfirmOpen(false);
      setSelectedTarget(null);
      onClose();
      onRefresh();
    } catch (error) {
      console.error('주문 이동 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedTarget(null);
  };

  if (!sourceTable) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>주문 이동</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            테이블 {sourceTable.table_number}의 주문을 이동할 테이블을 선택하세요.
          </Typography>

          {availableTables.length === 0 ? (
            <Box textAlign="center" py={2}>
              <Typography color="text.secondary">
                이동 가능한 테이블이 없습니다
              </Typography>
            </Box>
          ) : (
            <List>
              {availableTables.map((table) => (
                <ListItemButton
                  key={table.id}
                  onClick={() => handleSelect(table)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText
                    primary={`테이블 ${table.table_number}`}
                    secondary={`현재 ${table.orders.length}개 주문 | ${table.orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}원`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="주문 이동 확인"
        message={`테이블 ${sourceTable.table_number}의 주문을 테이블 ${selectedTarget?.table_number}로 이동하시겠습니까?`}
        confirmText="이동"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />
    </>
  );
};

export default TableTransferModal;
