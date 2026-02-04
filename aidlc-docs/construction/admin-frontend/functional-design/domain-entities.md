# Admin Frontend Domain Entities

## TypeScript Type Definitions

### 1. 인증 관련 타입

```typescript
// 관리자 정보
interface Admin {
  id: number;
  store_id: number;
  username: string;
  created_at: string;
}

// 로그인 요청
interface LoginRequest {
  store_id: number;
  username: string;
  password: string;
}

// 로그인 응답
interface LoginResponse {
  token: string;
  admin: Admin;
}

// 관리자 등록 요청
interface RegisterRequest {
  store_id: number;
  username: string;
  password: string;
}

// 인증 상태
interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### 2. 매장 관련 타입

```typescript
interface Store {
  id: number;
  name: string;
  created_at: string;
}
```

### 3. 테이블 관련 타입

```typescript
interface Table {
  id: number;
  store_id: number;
  table_number: number;
  session_id: string | null;
  current_total: number;
  created_at: string;
}

// 테이블 카드 표시용 (주문 포함)
interface TableWithOrders extends Table {
  orders: Order[];
  recent_orders: Order[]; // 최근 5개
}
```

### 4. 카테고리 관련 타입

```typescript
interface Category {
  id: number;
  store_id: number;
  name: string;
  display_order: number;
  created_at: string;
}

interface CategoryCreate {
  store_id: number;
  name: string;
  display_order?: number;
}

interface CategoryUpdate {
  name?: string;
  display_order?: number;
}
```

### 5. 메뉴 관련 타입

```typescript
interface Menu {
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

interface MenuCreate {
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  display_order?: number;
}

interface MenuUpdate {
  category_id?: number;
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_available?: boolean;
}
```

### 6. 옵션 관련 타입

```typescript
interface OptionGroup {
  id: number;
  menu_id: number;
  name: string;
  is_required: boolean;
  max_selections: number;
  options: Option[];
}

interface OptionGroupCreate {
  menu_id: number;
  name: string;
  is_required: boolean;
  max_selections?: number;
  options?: OptionCreate[];
}

interface Option {
  id: number;
  option_group_id: number;
  name: string;
  price: number;
}

interface OptionCreate {
  name: string;
  price: number;
}
```

### 7. 주문 관련 타입

```typescript
// 주문 상태
type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'COMPLETED';

interface Order {
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

interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: OrderItemOption[];
}

interface OrderItemOption {
  id: number;
  order_item_id: number;
  option_id: number;
  option_name: string;
  price: number;
}

// 주문 상태 변경 요청
interface OrderStatusUpdate {
  status: OrderStatus;
}
```

### 8. 주문 이력 타입

```typescript
interface OrderHistory {
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

interface OrderHistoryItem {
  menu_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: string[]; // 옵션 이름 목록
}
```

### 9. SSE 이벤트 타입

```typescript
type SSEEventType = 'NEW_ORDER' | 'ORDER_UPDATE' | 'ORDER_DELETE' | 'TABLE_UPDATE';

interface SSEEvent {
  type: SSEEventType;
  data: Order | Table;
  timestamp: string;
}
```

### 10. API 응답 타입

```typescript
// 성공 응답
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// 에러 응답
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
```

### 11. UI 상태 타입

```typescript
// 대시보드 상태
interface DashboardState {
  tables: TableWithOrders[];
  selectedTable: Table | null;
  selectedOrder: Order | null;
  isOrderDetailOpen: boolean;
  isHistoryOpen: boolean;
  loading: boolean;
  error: string | null;
}

// 메뉴 관리 상태
interface MenuManagementState {
  categories: Category[];
  menus: Menu[];
  selectedCategory: Category | null;
  selectedMenu: Menu | null;
  isFormOpen: boolean;
  formMode: 'create' | 'edit';
  loading: boolean;
  error: string | null;
}

// 이미지 업로드 상태
interface ImageUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  uploadedUrl: string | null;
  error: string | null;
}
```
