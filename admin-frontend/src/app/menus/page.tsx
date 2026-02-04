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
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Grid,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { getCategories, getMenus, deleteMenu } from '@/services/api';
import { Category, Menu } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import MenuForm from '@/components/MenuForm';
import OptionGroupForm from '@/components/OptionGroupForm';
import CategoryManagement from '@/components/CategoryManagement';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function MenusPage() {
  const router = useRouter();
  const { isAuthenticated, admin, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [menuFormOpen, setMenuFormOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [optionMenu, setOptionMenu] = useState<Menu | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
  const [deleting, setDeleting] = useState(false);

  const storeId = admin?.store_id || 1;

  // 인증 체크 - 임시 비활성화
  useEffect(() => {
    // if (!authLoading && !isAuthenticated) {
    //   router.push('/login');
    // }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // if (isAuthenticated && admin) {
      loadCategories();
    // }
  }, [isAuthenticated, admin]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadMenus(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const data = await getCategories(storeId);
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenus = async (categoryId: number) => {
    try {
      const data = await getMenus(storeId, categoryId);
      setMenus(data);
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
    }
  };

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedCategoryId(newValue);
  };

  const handleAddMenu = () => {
    setEditMenu(null);
    setMenuFormOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditMenu(menu);
    setMenuFormOpen(true);
  };

  const handleDeleteMenu = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMenu(deleteTarget.id);
      setDeleteTarget(null);
      if (selectedCategoryId) {
        loadMenus(selectedCategoryId);
      }
    } catch (error) {
      console.error('메뉴 삭제 실패:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleMenuSaved = () => {
    if (selectedCategoryId) {
      loadMenus(selectedCategoryId);
    }
  };

  const handleCategoryRefresh = () => {
    loadCategories();
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen message="로딩 중..." />;
  }

  // 인증 체크 - 임시 비활성화
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => router.push('/')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            메뉴 관리
          </Typography>
          <Button
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={() => setCategoryOpen(true)}
          >
            카테고리
          </Button>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={handleAddMenu}
          >
            메뉴 추가
          </Button>
        </Toolbar>
      </AppBar>

      {/* 카테고리 탭 */}
      {categories.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab key={category.id} label={category.name} value={category.id} />
            ))}
          </Tabs>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {categories.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              카테고리가 없습니다
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCategoryOpen(true)}
            >
              카테고리 추가
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {menus.map((menu) => (
              <Grid key={menu.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card>
                  {menu.image_url && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={menu.image_url}
                      alt={menu.name}
                    />
                  )}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Typography variant="h6" component="div">
                        {menu.name}
                      </Typography>
                      {!menu.is_available && (
                        <Chip label="품절" size="small" color="error" />
                      )}
                    </Box>
                    <Typography variant="h6" color="primary">
                      {menu.price.toLocaleString()}원
                    </Typography>
                    {menu.description && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {menu.description}
                      </Typography>
                    )}
                    {menu.option_groups && menu.option_groups.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        옵션 {menu.option_groups.length}개
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setOptionMenu(menu)}>
                      옵션
                    </Button>
                    <IconButton size="small" onClick={() => handleEditMenu(menu)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteTarget(menu)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {categories.length > 0 && menus.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              이 카테고리에 메뉴가 없습니다
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMenu}
            >
              메뉴 추가
            </Button>
          </Box>
        )}
      </Container>

      {/* 모달들 */}
      <MenuForm
        menu={editMenu}
        categories={categories}
        storeId={storeId}
        open={menuFormOpen}
        onClose={() => {
          setMenuFormOpen(false);
          setEditMenu(null);
        }}
        onSave={handleMenuSaved}
      />

      <OptionGroupForm
        menu={optionMenu}
        open={!!optionMenu}
        onClose={() => setOptionMenu(null)}
        onSave={handleMenuSaved}
      />

      <CategoryManagement
        categories={categories}
        storeId={storeId}
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        onRefresh={handleCategoryRefresh}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="메뉴 삭제"
        message={`'${deleteTarget?.name}' 메뉴를 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleDeleteMenu}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
