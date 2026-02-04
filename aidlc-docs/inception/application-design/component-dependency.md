# Component Dependencies

## 1. System Dependency Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                               │
├─────────────────────────┬───────────────────────────────────────┤
│                         │                                        │
│  ┌───────────────────┐  │  ┌───────────────────┐                │
│  │ Customer Frontend │  │  │  Admin Frontend   │                │
│  │                   │  │  │                   │                │
│  │ ┌───────────────┐ │  │  │ ┌───────────────┐ │                │
│  │ │   Contexts    │ │  │  │ │   Contexts    │ │                │
│  │ │ (Auth, Cart)  │ │  │  │ │    (Auth)     │ │                │
│  │ └───────┬───────┘ │  │  │ └───────┬───────┘ │                │
│  │         │         │  │  │         │         │                │
│  │ ┌───────▼───────┐ │  │  │ ┌───────▼───────┐ │                │
│  │ │  Components   │ │  │  │ │  Components   │ │                │
│  │ └───────┬───────┘ │  │  │ └───────┬───────┘ │                │
│  │         │         │  │  │         │         │                │
│  │ ┌───────▼───────┐ │  │  │ ┌───────▼───────┐ │                │
│  │ │   Services    │ │  │  │ │ Services+SSE  │ │                │
│  │ └───────┬───────┘ │  │  │ └───────┬───────┘ │                │
│  └─────────┼─────────┘  │  └─────────┼─────────┘                │
│            │            │            │                           │
└────────────┼────────────┴────────────┼───────────────────────────┘
             │      HTTP REST          │ HTTP REST + SSE
             └────────────┬────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      BACKEND LAYER                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Routes                              │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │  auth   │ │  menu   │ │  order  │ │  table  │        │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │    │
│  └───────┼───────────┼───────────┼───────────┼──────────────┘    │
│          │           │           │           │                   │
│  ┌───────▼───────────▼───────────▼───────────▼──────────────┐   │
│  │                     Services                              │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │   │
│  │  │   Auth    │ │   Menu    │ │   Order   │ │   Table   │ │   │
│  │  │  Service  │ │  Service  │ │  Service  │ │  Service  │ │   │
│  │  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ │   │
│  └────────┼─────────────┼─────────────┼─────────────┼────────┘   │
│           │             │             │             │            │
│  ┌────────▼─────────────▼─────────────▼─────────────▼────────┐  │
│  │                      Models                                │  │
│  │  Store │ Admin │ Table │ Category │ Menu │ Option │ Order  │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                         MySQL Database                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Internal Dependencies

### 2.1 Route → Service Dependencies

| Route | Depends On |
|-------|------------|
| `routes/auth.py` | `AuthService` |
| `routes/menu.py` | `MenuService` |
| `routes/order.py` | `OrderService`, `SSE Utils` |
| `routes/table.py` | `TableService`, `OrderService` |
| `routes/admin.py` | `MenuService`, `AuthService` |

### 2.2 Service → Model Dependencies

| Service | Depends On |
|---------|------------|
| `AuthService` | `Admin`, `Table`, `Store` |
| `MenuService` | `Menu`, `Category`, `OptionGroup`, `Option` |
| `OrderService` | `Order`, `OrderItem`, `OrderItemOption`, `Table` |
| `TableService` | `Table`, `Order`, `OrderHistory` |

### 2.3 Cross-Service Dependencies

```
TableService ──────► OrderService (주문 이동, 이용 완료 시)
OrderService ──────► SSE Utils (주문 이벤트 브로드캐스트)
```

---

## 3. Frontend Internal Dependencies

### 3.1 Customer Frontend

```
Pages
  │
  ├── page.tsx (메뉴) ──────► MenuCard, CategoryTabs
  │                          └──► CartContext (장바구니 추가)
  │
  ├── cart/page.tsx ────────► CartItem
  │                          └──► CartContext (수량 변경, 삭제)
  │
  ├── orders/page.tsx ──────► OrderStatus
  │                          └──► AuthContext (테이블 ID)
  │
  └── login/page.tsx ───────► AuthContext (로그인 처리)

Contexts
  │
  ├── AuthContext ──────────► localStorage (토큰 저장)
  │                          └──► api.ts (로그인 API)
  │
  └── CartContext ──────────► localStorage (장바구니 저장)
                             └──► api.ts (주문 생성)
```

### 3.2 Admin Frontend

```
Pages
  │
  ├── page.tsx (대시보드) ──► TableCard, OrderDetail, StatusButton
  │                          └──► SSE Service (실시간 주문)
  │
  ├── menus/page.tsx ───────► MenuForm, OptionGroupForm
  │                          └──► api.ts (메뉴 CRUD)
  │
  ├── tables/page.tsx ──────► TableCard
  │                          └──► api.ts (테이블 관리)
  │
  └── history/page.tsx ─────► api.ts (과거 주문 조회)

Contexts
  │
  └── AuthContext ──────────► localStorage (토큰 저장)
                             └──► api.ts (로그인 API)
```

---

## 4. Data Flow

### 4.1 Customer Order Flow

```
1. 고객이 메뉴 선택
   MenuCard → CartContext.addItem()
   
2. 장바구니에서 주문 확정
   CartContext.items → api.createOrder() → Backend
   
3. 백엔드 처리
   OrderService.create_order() → DB 저장
   OrderService.broadcast_order_event() → SSE 발행
   
4. 관리자 화면 업데이트
   SSE Event → Admin Dashboard 갱신
```

### 4.2 Admin Order Status Flow

```
1. 관리자가 상태 변경 버튼 클릭
   StatusButton → api.updateOrderStatus()
   
2. 백엔드 처리
   OrderService.update_order_status() → DB 업데이트
   OrderService.broadcast_order_event() → SSE 발행
   
3. 고객 화면 업데이트 (선택적)
   고객이 주문 내역 페이지 새로고침 시 반영
```

### 4.3 Table Transfer Flow

```
1. 관리자가 테이블 이동 요청
   TableCard → api.transferOrders(source, target)
   
2. 백엔드 처리
   TableService.transfer_orders()
     → Order.table_id 업데이트
     → 원본 테이블 세션 리셋
     → 대상 테이블 총액 재계산
   
3. SSE 이벤트 발행
   OrderService.broadcast_order_event('transfer', ...)
   
4. 관리자 대시보드 갱신
```

---

## 5. External Dependencies

### 5.1 Backend (Python)

```
fastapi
uvicorn
sqlalchemy
pymysql
python-jose[cryptography]  # JWT
passlib[bcrypt]            # Password hashing
python-multipart           # File upload
```

### 5.2 Frontend (Node.js)

```
next
react
@mui/material
@mui/icons-material
@emotion/react
@emotion/styled
typescript
```
