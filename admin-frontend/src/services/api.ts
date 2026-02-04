import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Table,
  Category,
  CategoryCreate,
  CategoryUpdate,
  Menu,
  MenuCreate,
  MenuUpdate,
  OptionGroup,
  OptionGroupCreate,
  Order,
  OrderStatus,
  OrderHistory,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ==================== 헬퍼 함수 ====================
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// ==================== 인증 API ====================
export const adminLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<LoginResponse>(response);
};

export const adminRegister = async (data: RegisterRequest): Promise<{ admin_id: number }> => {
  const response = await fetch(`${API_URL}/api/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ admin_id: number }>(response);
};

// ==================== 테이블 API ====================
export const getTables = async (storeId: number): Promise<Table[]> => {
  const response = await fetch(`${API_URL}/api/admin/tables?store_id=${storeId}`, {
    headers: authHeaders(),
  });
  return handleResponse<Table[]>(response);
};

export const completeTableSession = async (tableId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/tables/${tableId}/complete`, {
    method: 'POST',
    headers: authHeaders(),
  });
  await handleResponse<{ success: boolean }>(response);
};

export const transferOrders = async (sourceTableId: number, targetTableId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/tables/${sourceTableId}/transfer`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ target_table_id: targetTableId }),
  });
  await handleResponse<{ success: boolean }>(response);
};

export const getOrderHistory = async (tableId: number, date?: string): Promise<OrderHistory[]> => {
  const params = date ? `?date=${date}` : '';
  const response = await fetch(`${API_URL}/api/admin/tables/${tableId}/history${params}`, {
    headers: authHeaders(),
  });
  return handleResponse<OrderHistory[]>(response);
};

// ==================== 주문 API ====================
export const getAllOrders = async (storeId: number): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/api/admin/orders?store_id=${storeId}`, {
    headers: authHeaders(),
  });
  return handleResponse<Order[]>(response);
};

export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<Order> => {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Order>(response);
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<{ success: boolean }>(response);
};

// ==================== 카테고리 API ====================
export const getCategories = async (storeId: number): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/api/categories?store_id=${storeId}`, {
    headers: authHeaders(),
  });
  return handleResponse<Category[]>(response);
};

export const createCategory = async (data: CategoryCreate): Promise<Category> => {
  const response = await fetch(`${API_URL}/api/admin/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
};

export const updateCategory = async (categoryId: number, data: CategoryUpdate): Promise<Category> => {
  const response = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<{ success: boolean }>(response);
};

// ==================== 메뉴 API ====================
export const getMenus = async (storeId: number, categoryId?: number): Promise<Menu[]> => {
  const params = categoryId ? `?store_id=${storeId}&category_id=${categoryId}` : `?store_id=${storeId}`;
  const response = await fetch(`${API_URL}/api/menus${params}`, {
    headers: authHeaders(),
  });
  return handleResponse<Menu[]>(response);
};

export const createMenu = async (data: MenuCreate): Promise<Menu> => {
  const response = await fetch(`${API_URL}/api/admin/menus`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Menu>(response);
};

export const updateMenu = async (menuId: number, data: MenuUpdate): Promise<Menu> => {
  const response = await fetch(`${API_URL}/api/admin/menus/${menuId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Menu>(response);
};

export const deleteMenu = async (menuId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/menus/${menuId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<{ success: boolean }>(response);
};

// ==================== 옵션 API ====================
export const createOptionGroup = async (menuId: number, data: OptionGroupCreate): Promise<OptionGroup> => {
  const response = await fetch(`${API_URL}/api/admin/menus/${menuId}/options`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<OptionGroup>(response);
};

export const updateOptionGroup = async (optionGroupId: number, data: Partial<OptionGroupCreate>): Promise<OptionGroup> => {
  const response = await fetch(`${API_URL}/api/admin/options/${optionGroupId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<OptionGroup>(response);
};

export const deleteOptionGroup = async (optionGroupId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/options/${optionGroupId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<{ success: boolean }>(response);
};

// ==================== 이미지 업로드 ====================
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const response = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  return handleResponse<{ url: string }>(response);
};
