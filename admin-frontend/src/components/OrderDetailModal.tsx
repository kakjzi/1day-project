'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Order, ORDER_STATUS_CONFIG, getNextStatus } from '@/types';
import StatusChip from './StatusChip';
import { updateOrderStatus } from '@/services/api';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  open,
  onClose,
  onRefresh,
}) => {
  if (!order) return null;

  const handleStatusChange = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      await updateOrderStatus(order.id, nextStatus);
      onRefresh();
      onClose();
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">주문 #{order.id}</Typography>
          <StatusChip status={order.status} size="medium" />
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* 주문 정보 */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            테이블 {order.table_number} | {formatDateTime(order.created_at)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 주문 항목 */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>메뉴</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="right">금액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">{item.menu_name}</Typography>
                    {item.options.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        + {item.options.map((opt) => opt.option_name).join(', ')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.total_price.toLocaleString()}원
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  총 금액
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {order.total_amount.toLocaleString()}원
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        {order.status !== 'COMPLETED' && (
          <Button variant="contained" onClick={handleStatusChange}>
            {ORDER_STATUS_CONFIG[order.status].nextLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
