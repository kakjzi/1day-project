// ==================== 인증 관련 ====================
export interface Admin {
  id: number;
  store_id: number;
  username: string;
  created_at: string;
}

export interface LoginRequest {
  store_id: number;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface RegisterRequest {
  store_id: number;
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ==================== 매장 관련 ====================
export interface Store {
  id: number;
  name: string;
  created_at: string;
}

// ==================== 테이블 관련 ====================
export interface Table {
  id: number;
  store_id: number;
  table_number: number;
  session_id: string | null;
  current_total: number;
  created_at: string;
}

export interface TableWithOrders extends Table {
  orders: Order[];
}

// ==================== 카테고리 관련 ====================
export interface Category {
  id: number;
  store_id: number;
  name: string;
  display_order: number;
  created_at: string;
}

export interface CategoryCreate {
  store_id: number;
  name: string;
  display_order?: number;
}

export interface CategoryUpdate {
  name?: string;
  display_order?: number;
}

// ==================== 메뉴 관련 ====================
export interface Menu {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_available: boolean;
  created_at: string;
  option_groups?: OptionGroup[];
}

export interface MenuCreate {
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export interface MenuUpdate {
  category_id?: number;
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_available?: boolean;
}

// ==================== 옵션 관련 ====================
export interface OptionGroup {
  id: number;
  menu_id: number;
  name: string;
  is_required: boolean;
  max_selections: number;
  options: Option[];
}

export interface OptionGroupCreate {
  menu_id: number;
  name: string;
  is_required: boolean;
  max_selections?: number;
  options?: OptionCreate[];
}

export interface Option {
  id: number;
  option_group_id: number;
  name: string;
  price: number;
}

export interface OptionCreate {
  name: string;
  price: number;
}

// ==================== 주문 관련 ====================
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'COMPLETED';

export interface Order {
  id: number;
  store_id: number;
  table_id: number;
  table_number: number;
  session_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: OrderItemOption[];
}

export interface OrderItemOption {
  id: number;
  order_item_id: number;
  option_id: number;
  option_name: string;
  price: number;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}

// ==================== 주문 이력 ====================
export interface OrderHistory {
  id: number;
  original_order_id: number;
  store_id: number;
  table_id: number;
  table_number: number;
  session_id: string;
  total_amount: number;
  completed_at: string;
  items: OrderHistoryItem[];
}

export interface OrderHistoryItem {
  menu_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: string[];
}

// ==================== SSE 이벤트 ====================
export type SSEEventType = 'NEW_ORDER' | 'ORDER_UPDATE' | 'ORDER_DELETE' | 'TABLE_UPDATE';

export interface SSEEvent {
  type: SSEEventType;
  data: Order | Table;
  timestamp: string;
}

// ==================== API 응답 ====================
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// ==================== 상태 표시 ====================
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: 'warning' | 'info' | 'secondary' | 'success'; nextLabel?: string }> = {
  PENDING: { label: '대기중', color: 'warning', nextLabel: '접수' },
  ACCEPTED: { label: '접수', color: 'info', nextLabel: '준비 시작' },
  PREPARING: { label: '준비중', color: 'secondary', nextLabel: '완료' },
  COMPLETED: { label: '완료', color: 'success' },
};

export const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  const transitions: Record<OrderStatus, OrderStatus | null> = {
    PENDING: 'ACCEPTED',
    ACCEPTED: 'PREPARING',
    PREPARING: 'COMPLETED',
    COMPLETED: null,
  };
  return transitions[current];
};
