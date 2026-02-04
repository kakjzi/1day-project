'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  SwapHoriz as TransferIcon,
  CheckCircle as CompleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { TableWithOrders, Order, ORDER_STATUS_CONFIG, getNextStatus } from '@/types';
import StatusChip from './StatusChip';
import { updateOrderStatus, deleteOrder } from '@/services/api';
import ConfirmDialog from './ConfirmDialog';

interface TableCardProps {
  table: TableWithOrders;
  onOrderClick: (order: Order) => void;
  onTransfer: (table: TableWithOrders) => void;
  onComplete: (table: TableWithOrders) => void;
  onHistory: (table: TableWithOrders) => void;
  onRefresh: () => void;
  highlighted?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onOrderClick,
  onTransfer,
  onComplete,
  onHistory,
  onRefresh,
  highlighted = false,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const recentOrders = table.orders.slice(0, 5);
  const totalAmount = table.orders.reduce((sum, order) => sum + order.total_amount, 0);

  const handleStatusChange = async (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      await updateOrderStatus(order.id, nextStatus);
      onRefresh();
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setLoading(true);
    try {
      await deleteOrder(deleteConfirm.id);
      setDeleteConfirm(null);
      onRefresh();
    } catch (error) {
      console.error('주문 삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const getOrderSummary = (order: Order) => {
    if (order.items.length === 0) return '메뉴 없음';
    const first = order.items[0].menu_name;
    if (order.items.length === 1) return first;
    return `${first} 외 ${order.items.length - 1}개`;
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          transition: 'all 0.3s ease',
          ...(highlighted && {
            boxShadow: '0 0 20px rgba(255, 152, 0, 0.5)',
            borderColor: 'warning.main',
            borderWidth: 2,
            borderStyle: 'solid',
          }),
        }}
      >
        <CardContent>
          {/* 헤더 */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              테이블 {table.table_number}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalAmount.toLocaleString()}원
            </Typography>
          </Box>

          {/* 액션 버튼 */}
          <Box display="flex" gap={0.5} mb={2}>
            <Tooltip title="주문 이동">
              <IconButton size="small" onClick={() => onTransfer(table)} disabled={table.orders.length === 0}>
                <TransferIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="이용 완료">
              <IconButton size="small" onClick={() => onComplete(table)} color="success">
                <CompleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="과거 내역">
              <IconButton size="small" onClick={() => onHistory(table)}>
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* 주문 목록 */}
          {recentOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              주문 없음
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  onClick={() => onOrderClick(order)}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" fontWeight="bold">
                      #{order.id}
                    </Typography>
                    <StatusChip status={order.status} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {getOrderSummary(order)}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(order.created_at)}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      {order.status !== 'COMPLETED' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order);
                            }}
                            sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.7rem' }}
                          >
                            {ORDER_STATUS_CONFIG[order.status].nextLabel}
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(order);
                            }}
                            sx={{ p: 0.25 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              {table.orders.length > 5 && (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  +{table.orders.length - 5}개 더 보기
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={!!deleteConfirm}
        title="주문 삭제"
        message={`주문 #${deleteConfirm?.id}을 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        loading={loading}
      />
    </>
  );
};

export default TableCard;
