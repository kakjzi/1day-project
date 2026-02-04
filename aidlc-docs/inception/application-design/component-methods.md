# Component Methods

## 1. Backend API Endpoints

### 1.1 Authentication Routes (`routes/auth.py`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/tables/login` | 테이블 로그인 | `{store_id, table_number, pin}` | `{token, table_id}` |
| POST | `/api/admin/login` | 관리자 로그인 | `{store_id, username, password}` | `{token, admin_id}` |
| POST | `/api/admin/register` | 관리자 등록 | `{store_id, username, password}` | `{admin_id}` |

### 1.2 Menu Routes (`routes/menu.py`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/api/menus` | 메뉴 목록 조회 | `?store_id` | `[Menu]` |
| GET | `/api/menus/{id}` | 메뉴 상세 조회 | - | `Menu` |
| GET | `/api/categories` | 카테고리 목록 | `?store_id` | `[Category]` |

### 1.3 Admin Menu Routes (`routes/admin.py`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/admin/menus` | 메뉴 등록 | `MenuCreate` | `Menu` |
| PUT | `/api/admin/menus/{id}` | 메뉴 수정 | `MenuUpdate` | `Menu` |
| DELETE | `/api/admin/menus/{id}` | 메뉴 삭제 | - | `{success}` |
| POST | `/api/admin/categories` | 카테고리 등록 | `CategoryCreate` | `Category` |
| PUT | `/api/admin/categories/{id}` | 카테고리 수정 | `CategoryUpdate` | `Category` |
| DELETE | `/api/admin/categories/{id}` | 카테고리 삭제 | - | `{success}` |
| POST | `/api/admin/menus/{id}/options` | 옵션 그룹 추가 | `OptionGroupCreate` | `OptionGroup` |
| PUT | `/api/admin/options/{id}` | 옵션 그룹 수정 | `OptionGroupUpdate` | `OptionGroup` |
| DELETE | `/api/admin/options/{id}` | 옵션 그룹 삭제 | - | `{success}` |
| POST | `/api/admin/upload` | 이미지 업로드 | `multipart/form-data` | `{url}` |

### 1.4 Order Routes (`routes/order.py`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/orders` | 주문 생성 | `OrderCreate` | `Order` |
| GET | `/api/orders` | 현재 세션 주문 목록 | `?table_id` | `[Order]` |
| GET | `/api/admin/orders/stream` | SSE 주문 스트림 | `?store_id=1&token={jwt_token}` | `SSE Events` |
| PATCH | `/api/admin/orders/{id}/status` | 주문 상태 변경 | `{status}` | `Order` |
| DELETE | `/api/admin/orders/{id}` | 주문 삭제 | - | `{success}` |

**Note**: SSE 엔드포인트는 쿼리 파라미터로 토큰을 전달합니다 (EventSource API는 커스텀 헤더를 지원하지 않음)

### 1.5 Table Routes (`routes/table.py`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/api/admin/tables` | 테이블 목록 | `?store_id` | `[Table]` |
| POST | `/api/admin/tables` | 테이블 등록 | `TableCreate` | `Table` |
| PUT | `/api/admin/tables/{id}` | 테이블 수정 | `TableUpdate` | `Table` |
| POST | `/api/admin/tables/{id}/complete` | 이용 완료 | - | `{success}` |
| POST | `/api/admin/tables/{id}/transfer` | 주문 이동 | `{target_table_id}` | `{success}` |
| GET | `/api/admin/tables/{id}/history` | 과거 주문 조회 | `?date` | `[OrderHistory]` |

---

## 2. Backend Services

### 2.1 AuthService (`services/auth_service.py`)

```python
class AuthService:
    def authenticate_table(store_id, table_number, pin) -> Token
    def authenticate_admin(store_id, username, password) -> Token
    def register_admin(store_id, username, password) -> Admin
    def verify_token(token) -> dict
    def hash_password(password) -> str
    def verify_password(password, hashed) -> bool
```

### 2.2 MenuService (`services/menu_service.py`)

```python
class MenuService:
    def get_menus(store_id) -> List[Menu]
    def get_menu(menu_id) -> Menu
    def create_menu(data: MenuCreate) -> Menu
    def update_menu(menu_id, data: MenuUpdate) -> Menu
    def delete_menu(menu_id) -> bool
    def get_categories(store_id) -> List[Category]
    def create_category(data: CategoryCreate) -> Category
    def update_category(category_id, data) -> Category
    def delete_category(category_id) -> bool
    def create_option_group(menu_id, data) -> OptionGroup
    def update_option_group(option_group_id, data) -> OptionGroup
    def delete_option_group(option_group_id) -> bool
    def upload_image(file) -> str  # returns URL
```

### 2.3 OrderService (`services/order_service.py`)

```python
class OrderService:
    def create_order(data: OrderCreate) -> Order
    def get_orders_by_table(table_id, session_id) -> List[Order]
    def get_all_active_orders(store_id) -> List[Order]
    def update_order_status(order_id, status) -> Order
    def delete_order(order_id) -> bool  # only if not COMPLETED
    def broadcast_order_event(event_type, order) -> None  # SSE
```

### 2.4 TableService (`services/table_service.py`)

```python
class TableService:
    def get_tables(store_id) -> List[Table]
    def create_table(data: TableCreate) -> Table
    def update_table(table_id, data: TableUpdate) -> Table
    def complete_table_session(table_id) -> bool
    def transfer_orders(source_table_id, target_table_id) -> bool
    def get_order_history(table_id, date_filter) -> List[OrderHistory]
    def start_new_session(table_id) -> str  # returns session_id
```

---

## 3. Frontend Services

### 3.1 Customer API (`customer-frontend/services/api.ts`)

```typescript
// Auth
tableLogin(storeId, tableNumber, pin): Promise<{token, tableId}>

// Menu
getMenus(storeId): Promise<Menu[]>
getMenu(menuId): Promise<Menu>
getCategories(storeId): Promise<Category[]>

// Order
createOrder(orderData): Promise<Order>
getOrders(tableId): Promise<Order[]>
```

### 3.2 Admin API (`admin-frontend/services/api.ts`)

```typescript
// Auth
adminLogin(storeId, username, password): Promise<{token}>
registerAdmin(storeId, username, password): Promise<{adminId}>

// Menu Management
createMenu(menuData): Promise<Menu>
updateMenu(menuId, menuData): Promise<Menu>
deleteMenu(menuId): Promise<void>
createCategory(categoryData): Promise<Category>
updateCategory(categoryId, data): Promise<Category>
deleteCategory(categoryId): Promise<void>
uploadImage(file): Promise<{url}>

// Order Management
updateOrderStatus(orderId, status): Promise<Order>
deleteOrder(orderId): Promise<void>

// Table Management
getTables(storeId): Promise<Table[]>
createTable(tableData): Promise<Table>
completeTableSession(tableId): Promise<void>
transferOrders(sourceId, targetId): Promise<void>
getOrderHistory(tableId, date?): Promise<OrderHistory[]>
```

### 3.3 SSE Service (`admin-frontend/services/sse.ts`)

```typescript
class SSEService {
    connect(storeId): EventSource
    disconnect(): void
    onNewOrder(callback): void
    onOrderUpdate(callback): void
    onError(callback): void
}
```

---

## 4. Error Response Format

```json
{
    "code": "ERR_001",
    "message": "Human readable error message",
    "details": {
        "field": "additional context"
    }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_002 | 401 | Token expired |
| AUTH_003 | 403 | Insufficient permissions |
| MENU_001 | 404 | Menu not found |
| MENU_002 | 400 | Invalid menu data |
| ORDER_001 | 404 | Order not found |
| ORDER_002 | 400 | Cannot delete completed order |
| TABLE_001 | 404 | Table not found |
| TABLE_002 | 400 | Invalid table operation |
| FILE_001 | 400 | File too large (max 1MB) |
| FILE_002 | 400 | Invalid file type |
