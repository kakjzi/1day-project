# Customer Frontend - State Management

## 1. Context 구조

```
src/contexts/
├── AuthContext.tsx       # 테이블 인증 상태
└── CartContext.tsx       # 장바구니 상태
```

---

## 2. AuthContext

### State
```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  storeId: number | null;
  storeName: string | null;
  tableId: number | null;
  tableNumber: number | null;
  sessionId: string | null;
  token: string | null;
}
```

### Actions
```typescript
interface AuthActions {
  login: (storeId: number, tableNumber: number, pin: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;  // 앱 시작 시 localStorage 확인
}
```

### localStorage 동기화
```typescript
// 저장 키
const AUTH_STORAGE_KEY = 'table_order_auth';

// 저장 데이터
interface StoredAuth {
  storeId: number;
  tableNumber: number;
  pin: string;  // 자동 로그인용
  token: string;
  tokenExpiry: string;
}

// 로그인 성공 시
localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));

// 앱 시작 시
const stored = localStorage.getItem(AUTH_STORAGE_KEY);
if (stored) {
  // 토큰 만료 확인 후 자동 로그인 또는 저장된 정보로 재로그인
}
```

---

## 3. CartContext

### State
```typescript
interface CartItem {
  id: string;              // 클라이언트 생성 UUID (같은 메뉴 다른 옵션 구분)
  menuId: number;
  menuName: string;
  menuImage: string;
  basePrice: number;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;       // (basePrice + 옵션가격) × quantity
}

interface SelectedOption {
  optionGroupId: number;
  optionGroupName: string;
  optionId: number;
  optionName: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;      // 전체 수량 합계
  totalAmount: number;     // 전체 금액 합계
  isLoading: boolean;
}
```

### Actions
```typescript
interface CartActions {
  addItem: (item: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;  // 서버 동기화
  loadFromServer: () => Promise<void>;  // 서버에서 로드
}
```

### localStorage 동기화
```typescript
// 저장 키
const CART_STORAGE_KEY = 'table_order_cart';

// 변경 시마다 저장
useEffect(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  syncWithServer();  // 서버에도 동기화
}, [items]);

// 앱 시작 시
const stored = localStorage.getItem(CART_STORAGE_KEY);
if (stored) {
  setItems(JSON.parse(stored));
}
// 서버 데이터와 병합 (서버 우선)
await loadFromServer();
```

---

## 4. Context Provider 구조

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 5. 서버 동기화 전략

### 장바구니 동기화
```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Server    │
│ localStorage│                    │   Cart DB   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  1. 아이템 추가/수정/삭제         │
       │─────────────────────────────────>│
       │     POST/PUT/DELETE /api/cart    │
       │                                  │
       │  2. 앱 시작 시 로드               │
       │<─────────────────────────────────│
       │     GET /api/cart                │
       │                                  │
       │  3. 충돌 시 서버 우선             │
       │                                  │
```

### 동기화 타이밍
- 아이템 추가/수정/삭제 시 → 즉시 서버 동기화
- 앱 시작 시 → 서버에서 로드 (서버 우선)
- 네트워크 오류 시 → localStorage만 업데이트, 재연결 시 동기화
