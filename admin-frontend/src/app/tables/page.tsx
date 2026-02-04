'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { getTables } from '@/services/api';
import { Table as TableType } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TablesPage() {
  const router = useRouter();
  const { isAuthenticated, admin, loading: authLoading } = useAuth();

  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);

  const storeId = admin?.store_id || 1;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && admin) {
      loadTables();
    }
  }, [isAuthenticated, admin]);

  const loadTables = async () => {
    try {
      const data = await getTables(storeId);
      setTables(data);
    } catch (error) {
      console.error('테이블 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen message="로딩 중..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => router.push('/')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            테이블 관리
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>테이블 번호</TableCell>
                <TableCell>세션 상태</TableCell>
                <TableCell align="right">현재 총액</TableCell>
                <TableCell>생성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>
                    <Typography fontWeight="bold">
                      테이블 {table.table_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={table.session_id ? '사용 중' : '비어 있음'}
                      color={table.session_id ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {table.current_total.toLocaleString()}원
                  </TableCell>
                  <TableCell>
                    {new Date(table.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {tables.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              등록된 테이블이 없습니다
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
