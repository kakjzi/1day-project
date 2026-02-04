'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { adminRegister } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    store_id: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    setSubmitting(true);

    try {
      await adminRegister({
        store_id: parseInt(formData.store_id, 10),
        username: formData.username,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '등록에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" textAlign="center" mb={3}>
            관리자 등록
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              등록이 완료되었습니다. 로그인 페이지로 이동합니다...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="매장 ID"
              name="store_id"
              type="number"
              value={formData.store_id}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              disabled={success}
            />
            <TextField
              fullWidth
              label="사용자명"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              helperText="최소 3자 이상"
              disabled={success}
            />
            <TextField
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              helperText="최소 6자 이상"
              disabled={success}
            />
            <TextField
              fullWidth
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              margin="normal"
              required
              disabled={success}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || success}
              sx={{ mt: 3, mb: 2 }}
            >
              {submitting ? '등록 중...' : '등록'}
            </Button>
          </form>

          <Typography variant="body2" textAlign="center">
            이미 계정이 있으신가요?{' '}
            <MuiLink component={Link} href="/login">
              로그인
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
