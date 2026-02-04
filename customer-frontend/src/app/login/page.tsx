// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(Number(tableNumber), pin);
      router.push('/');
    } catch {
      setError('로그인에 실패했습니다. 테이블 번호와 PIN을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 4 }}>테이블오더</Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="테이블 번호" type="number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="PIN (4자리)" type="password" value={pin} onChange={e => setPin(e.target.value.slice(0, 4))} inputProps={{ maxLength: 4 }} fullWidth required sx={{ mb: 3 }} />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading || !tableNumber || pin.length !== 4}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
