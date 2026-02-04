'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { TableWithOrders, OrderHistory } from '@/types';
import { getOrderHistory } from '@/services/api';
import LoadingSpinner from './LoadingSpinner';

interface OrderHistoryModalProps {
  table: TableWithOrders | null;
  open: boolean;
  onClose: () => void;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  table,
  open,
  onClose,
}) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (open && table) {
      loadHistory();
    }
  }, [open, table, date]);

  const loadHistory = async () => {
    if (!table) return;
    setLoading(true);
    try {
      const data = await getOrderHistory(table.id, date);
      setHistory(data);
    } catch (error) {
      console.error('이력 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('ko-KR');
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!table) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        테이블 {table.table_number} - 과거 주문 내역
      </DialogTitle>
      <DialogContent>
        {/* 날짜 선택 */}
        <Box mb={2}>
          <TextField
            type="date"
            label="날짜 선택"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* 이력 목록 */}
        {loading ? (
          <LoadingSpinner message="이력 로딩 중..." />
        ) : history.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              해당 날짜의 주문 내역이 없습니다
            </Typography>
          </Box>
        ) : (
          <List>
            {history.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem
                  sx={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(order.id)}
                  secondaryAction={
                    <IconButton edge="end">
                      {expandedId === order.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">
                          주문 #{order.original_order_id}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          {order.total_amount.toLocaleString()}원
                        </Typography>
                      </Box>
                    }
                    secondary={`완료: ${formatDateTime(order.completed_at)}`}
                  />
                </ListItem>
                <Collapse in={expandedId === order.id}>
                  <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                    {order.items.map((item, idx) => (
                      <Box key={idx} display="flex" justifyContent="space-between" py={0.5}>
                        <Typography variant="body2">
                          {item.menu_name} x {item.quantity}
                          {item.options.length > 0 && (
                            <Typography component="span" variant="caption" color="text.secondary">
                              {' '}({item.options.join(', ')})
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2">
                          {item.total_price.toLocaleString()}원
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderHistoryModal;
