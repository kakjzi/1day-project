// src/services/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const headers = () => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: headers() });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

// Auth
export const login = (tableNumber: number, pin: string) =>
  request<{ access_token: string }>('/api/tables/login', {
    method: 'POST',
    body: JSON.stringify({ table_number: tableNumber, pin }),
  });

// Menu
export const getMenus = () => request<import('@/types').Menu[]>('/api/menus');
export const getMenu = (id: number) => request<import('@/types').MenuDetail>(`/api/menus/${id}`);

// Cart
export const getCart = () => request<import('@/types').CartItem[]>('/api/cart');
export const addToCart = (item: Omit<import('@/types').CartItem, 'id' | 'itemTotal'>) =>
  request<import('@/types').CartItem>('/api/cart', { method: 'POST', body: JSON.stringify(item) });
export const updateCartItem = (id: string, quantity: number) =>
  request<import('@/types').CartItem>(`/api/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
export const removeCartItem = (id: string) =>
  request<void>(`/api/cart/${id}`, { method: 'DELETE' });
export const clearServerCart = () => request<void>('/api/cart', { method: 'DELETE' });

// Orders
export const createOrder = () =>
  request<import('@/types').Order>('/api/orders', { method: 'POST' });
export const getOrders = () => request<import('@/types').Order[]>('/api/orders');
