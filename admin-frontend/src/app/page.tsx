'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { getTables, getAllOrders } from '@/services/api';
import { sseService } from '@/services/sse';
import { Order, TableWithOrders } from '@/types';
import TableCard from '@/components/TableCard';
import OrderDetailModal from '@/components/OrderDetailModal';
import TableTransferModal from '@/components/TableTransferModal';
import OrderHistoryModal from '@/components/OrderHistoryModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import { completeTableSession } from '@/services/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, admin, loading: authLoading, logout } = useAuth();

  const [tables, setTables] = useState<TableWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const [highlightedTableId, setHighlightedTableId] = useState<number | null>(null);

  // 모달 상태
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transferTable, setTransferTable] = useState<TableWithOrders | null>(null);
  const [historyTable, setHistoryTable] = useState<TableWithOrders | null>(null);
  const [completeTable, setCompleteTable] = useState<TableWithOrders | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);

  // 네비게이션 메뉴
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 알림음 임시 비활성화
  // const audioRef = useRef<HTMLAudioElement | null>(null);

  const storeId = admin?.store_id || 1;

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const [tablesData, ordersData] = await Promise.all([
        getTables(storeId),
        getAllOrders(storeId),
      ]);

      // 테이블에 주문 매핑
      const tablesWithOrders: TableWithOrders[] = tablesData.map((table) => ({
        ...table,
        orders: ordersData
          .filter((order) => order.table_id === table.id && order.status !== 'COMPLETED')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      }));

      setTables(tablesWithOrders);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  // 인증 체크 - 임시 비활성화
  useEffect(() => {
    // if (!authLoading && !isAuthenticated) {
    //   router.push('/login');
    // }
  }, [authLoading, isAuthenticated, router]);

  // 초기 데이터 로드 및 SSE 연결
  useEffect(() => {
    // if (!isAuthenticated || !admin) return;

    loadData();

    // SSE 연결
    sseService.connect(storeId);
    setSseConnected(true);

    // SSE 이벤트 핸들러
    sseService.onNewOrder((order) => {
      // 알림음 재생 - 임시 비활성화 (파일 없음)
      // if (audioRef.current) {
      //   audioRef.current.play().catch(() => {});
      // }

      // 하이라이트 효과
      setHighlightedTableId(order.table_id);
      setTimeout(() => setHighlightedTableId(null), 3000);

      // 데이터 새로고침
      loadData();
    });

    sseService.onOrderUpdate(() => {
      loadData();
    });

    sseService.onOrderDelete(() => {
      loadData();
    });

    sseService.onTableUpdate(() => {
      loadData();
    });

    return () => {
      sseService.disconnect();
      setSseConnected(false);
    };
  }, [isAuthenticated, admin, storeId, loadData]);

  // 이용 완료 처리
  const handleComplete = async () => {
    if (!completeTable) return;
    setCompleteLoading(true);
    try {
      await completeTableSession(completeTable.id);
      setCompleteTable(null);
      loadData();
    } catch (error) {
      console.error('이용 완료 실패:', error);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen message="로딩 중..." />;
  }

  // 임시로 인증 체크 비활성화
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 알림음 - 임시 비활성화 */}
      {/* <audio ref={audioRef} src="/notification.mp3" preload="auto" /> */}

      {/* 앱바 */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            테이블오더 관리자
          </Typography>
          <Chip
            label={sseConnected ? '연결됨' : '연결 끊김'}
            color={sseConnected ? 'success' : 'error'}
            size="small"
            sx={{ mr: 2 }}
          />
          <IconButton color="inherit" onClick={loadData}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 네비게이션 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setAnchorEl(null); router.push('/'); }}>
          대시보드
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); router.push('/menus'); }}>
          메뉴 관리
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); router.push('/tables'); }}>
          테이블 관리
        </MenuItem>
      </Menu>

      {/* 메인 컨텐츠 */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid key={table.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TableCard
                table={table}
                onOrderClick={setSelectedOrder}
                onTransfer={setTransferTable}
                onComplete={setCompleteTable}
                onHistory={setHistoryTable}
                onRefresh={loadData}
                highlighted={highlightedTableId === table.id}
              />
            </Grid>
          ))}
        </Grid>

        {tables.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              등록된 테이블이 없습니다
            </Typography>
          </Box>
        )}
      </Container>

      {/* 모달들 */}
      <OrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onRefresh={loadData}
      />

      <TableTransferModal
        sourceTable={transferTable}
        tables={tables}
        open={!!transferTable}
        onClose={() => setTransferTable(null)}
        onRefresh={loadData}
      />

      <OrderHistoryModal
        table={historyTable}
        open={!!historyTable}
        onClose={() => setHistoryTable(null)}
      />

      <ConfirmDialog
        open={!!completeTable}
        title="이용 완료"
        message={`테이블 ${completeTable?.table_number}의 이용을 완료하시겠습니까? 현재 주문이 이력으로 이동됩니다.`}
        confirmText="완료"
        onConfirm={handleComplete}
        onCancel={() => setCompleteTable(null)}
        loading={completeLoading}
      />
    </Box>
  );
}
