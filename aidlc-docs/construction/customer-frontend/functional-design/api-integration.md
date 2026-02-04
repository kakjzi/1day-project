# Customer Frontend - API Integration

## 1. API 서비스 구조

```
src/services/
└── api.ts              # 모든 API 호출 함수
```

---

## 2. Base Configuration

```typescript
// src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('table_order_auth')
    ? JSON.parse(localStorage.getItem('table_order_auth')!).token
    : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.code, error.message, error.details);
  }

  return response.json();
}
```

---

## 3. API Functions

### 3.1 인증 API

```typescript
// 테이블 로그인
export async function tableLogin(
  storeId: number,
  tableNumber: number,
  pin: string
): Promise<LoginResponse> {
  return fetchAPI('/api/tables/login', {
    method: 'POST',
    body: JSON.stringify({ store_id: storeId, table_number: tableNumber, pin }),
  });
}

interface LoginResponse {
  token: string;
  table_id: number;
  store_id: number;
  store_name: string;
  table_number: number;
  session_id: string;
}
```

### 3.2 메뉴 API

```typescript
// 카테고리 목록 조회
export async function getCategories(storeId: number): Promise<Category[]> {
  return fetchAPI(`/api/categories?store_id=${storeId}`);
}

// 메뉴 목록 조회
export async function getMenus(storeId: number): Promise<Menu[]> {
  return fetchAPI(`/api/menus?store_id=${storeId}`);
}

// 메뉴 상세 조회
export async function getMenu(menuId: number): Promise<MenuDetail> {
  return fetchAPI(`/api/menus/${menuId}`);
}

interface Category {
  id: number;
  name: string;
  sort_order: number;
}

interface Menu {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_sold_out: boolean;
}

interface MenuDetail extends Menu {
  option_groups: OptionGroup[];
}

interface OptionGroup {
  id: number;
  name: string;
  is_required: boolean;
  max_select: number;
  options: Option[];
}

interface Option {
  id: number;
  name: string;
  price: number;
}
```

### 3.3 장바구니 API

```typescript
// 장바구니 조회
export async function getCart(tableId: number): Promise<CartItem[]> {
  return fetchAPI(`/api/cart?table_id=${tableId}`);
}

// 장바구니 아이템 추가
export async function addCartItem(
  tableId: number,
  item: AddCartItemRequest
): Promise<CartItem> {
  return fetchAPI('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ table_id: tableId, ...item }),
  });
}

// 장바구니 아이템 수정 (수량)
export async function updateCartItem(
  cartItemId: number,
  quantity: number
): Promise<CartItem> {
  return fetchAPI(`/api/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

// 장바구니 아이템 삭제
export async function deleteCartItem(cartItemId: number): Promise<void> {
  return fetchAPI(`/api/cart/${cartItemId}`, {
    method: 'DELETE',
  });
}

// 장바구니 비우기
export async function clearCart(tableId: number): Promise<void> {
  return fetchAPI(`/api/cart/clear?table_id=${tableId}`, {
    method: 'DELETE',
  });
}

interface AddCartItemRequest {
  menu_id: number;
  quantity: number;
  options: { option_id: number }[];
}
```

### 3.4 주문 API

```typescript
// 주문 생성
export async function createOrder(tableId: number): Promise<Order> {
  return fetchAPI('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ table_id: tableId }),
  });
}

// 현재 세션 주문 목록 조회
export async function getOrders(tableId: number): Promise<Order[]> {
  return fetchAPI(`/api/orders?table_id=${tableId}`);
}

interface Order {
  id: number;
  display_number: string;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'COMPLETED';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: OrderItemOption[];
}

interface OrderItemOption {
  option_name: string;
  price: number;
}
```

---

## 4. Error Handling

```typescript
class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 사용 예시
try {
  await createOrder(tableId);
} catch (error) {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'MENU_002':
        alert(`품절된 메뉴가 있습니다: ${error.details?.menu_name}`);
        break;
      case 'AUTH_002':
        // 토큰 만료 - 재로그인
        logout();
        break;
      default:
        alert(error.message);
    }
  }
}
```

---

## 5. API 호출 타이밍

| 화면 | API 호출 | 타이밍 |
|------|----------|--------|
| 앱 시작 | `getCart` | 인증 후 즉시 |
| 메뉴 화면 | `getCategories`, `getMenus` | 페이지 로드 시 |
| 메뉴 상세 | `getMenu` | 모달 열릴 때 |
| 장바구니 추가 | `addCartItem` | 담기 버튼 클릭 |
| 수량 변경 | `updateCartItem` | +/- 버튼 클릭 |
| 아이템 삭제 | `deleteCartItem` | 삭제 버튼 클릭 |
| 주문 생성 | `createOrder` | 주문하기 버튼 클릭 |
| 주문 내역 | `getOrders` | 페이지 로드 시 |
