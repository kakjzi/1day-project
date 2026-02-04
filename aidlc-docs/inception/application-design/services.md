# Services Design

## 1. Service Layer Overview

서비스 레이어는 비즈니스 로직을 캡슐화하고 라우트와 데이터 모델 사이를 중재합니다.

```
Routes (HTTP 처리) → Services (비즈니스 로직) → Models (데이터 접근)
```

---

## 2. Service Definitions

### 2.1 AuthService

**책임**: 인증 및 권한 관리

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `authenticate_table` | store_id, table_number, pin | Token | 테이블 로그인 |
| `authenticate_admin` | store_id, username, password | Token | 관리자 로그인 |
| `register_admin` | store_id, username, password | Admin | 관리자 등록 |
| `verify_token` | token | dict (payload) | 토큰 검증 |
| `hash_password` | password | str | 비밀번호 해싱 |
| `verify_password` | password, hashed | bool | 비밀번호 검증 |

**의존성**: `Admin`, `Table`, `Store` 모델

---

### 2.2 MenuService

**책임**: 메뉴 및 카테고리 관리

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `get_menus` | store_id | List[Menu] | 메뉴 목록 조회 |
| `get_menu` | menu_id | Menu | 메뉴 상세 조회 |
| `create_menu` | MenuCreate | Menu | 메뉴 등록 |
| `update_menu` | menu_id, MenuUpdate | Menu | 메뉴 수정 |
| `delete_menu` | menu_id | bool | 메뉴 삭제 |
| `get_categories` | store_id | List[Category] | 카테고리 목록 |
| `create_category` | CategoryCreate | Category | 카테고리 등록 |
| `update_category` | category_id, data | Category | 카테고리 수정 |
| `delete_category` | category_id | bool | 카테고리 삭제 |
| `create_option_group` | menu_id, data | OptionGroup | 옵션 그룹 추가 |
| `update_option_group` | option_group_id, data | OptionGroup | 옵션 그룹 수정 |
| `delete_option_group` | option_group_id | bool | 옵션 그룹 삭제 |
| `upload_image` | file | str (url) | 이미지 업로드 |

**의존성**: `Menu`, `Category`, `OptionGroup`, `Option` 모델

**비즈니스 규칙**:
- 이미지 파일 크기 1MB 제한
- 카테고리 삭제 시 해당 메뉴도 삭제 또는 미분류로 이동

---

### 2.3 OrderService

**책임**: 주문 처리 및 실시간 이벤트

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `create_order` | OrderCreate | Order | 주문 생성 |
| `get_orders_by_table` | table_id, session_id | List[Order] | 테이블 주문 조회 |
| `get_all_active_orders` | store_id | List[Order] | 전체 활성 주문 |
| `update_order_status` | order_id, status | Order | 상태 변경 |
| `delete_order` | order_id | bool | 주문 삭제 |
| `broadcast_order_event` | event_type, order | None | SSE 이벤트 발행 |

**의존성**: `Order`, `OrderItem`, `OrderItemOption`, `Table` 모델, SSE Utils

**비즈니스 규칙**:
- 주문 생성 시 자동으로 PENDING 상태
- COMPLETED 상태 주문은 삭제 불가
- 상태 변경 시 SSE 이벤트 자동 발행

---

### 2.4 TableService

**책임**: 테이블 및 세션 관리

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `get_tables` | store_id | List[Table] | 테이블 목록 |
| `create_table` | TableCreate | Table | 테이블 등록 |
| `update_table` | table_id, TableUpdate | Table | 테이블 수정 |
| `complete_table_session` | table_id | bool | 이용 완료 |
| `transfer_orders` | source_id, target_id | bool | 주문 이동 |
| `get_order_history` | table_id, date | List[OrderHistory] | 과거 주문 |
| `start_new_session` | table_id | str (session_id) | 새 세션 시작 |

**의존성**: `Table`, `Order`, `OrderHistory` 모델, `OrderService`

**비즈니스 규칙**:
- 이용 완료 시 현재 세션 주문을 OrderHistory로 이동
- 주문 이동 시 대상 테이블 총액 합산
- 새 세션 시작 시 UUID 생성

---

## 3. Service Interactions

### 3.1 주문 생성 시퀀스

```
1. Route: POST /api/orders
2. OrderService.create_order()
   - 주문 데이터 검증
   - Order, OrderItem, OrderItemOption 생성
   - 테이블 세션 ID 확인 (없으면 새 세션 시작)
3. OrderService.broadcast_order_event('new_order', order)
   - SSE 구독자들에게 이벤트 전송
4. Return: Order 객체
```

### 3.2 테이블 이용 완료 시퀀스

```
1. Route: POST /api/admin/tables/{id}/complete
2. TableService.complete_table_session()
   - 현재 세션의 모든 주문 조회
   - OrderHistory로 복사
   - 원본 주문 삭제 또는 archived 플래그
   - 테이블 세션 ID 초기화
3. OrderService.broadcast_order_event('table_complete', table_id)
4. Return: success
```

### 3.3 테이블 주문 이동 시퀀스

```
1. Route: POST /api/admin/tables/{id}/transfer
2. TableService.transfer_orders(source_id, target_id)
   - 원본 테이블 주문 조회
   - 주문의 table_id를 대상 테이블로 변경
   - 원본 테이블 세션 리셋
3. OrderService.broadcast_order_event('order_transfer', data)
4. Return: success
```

---

## 4. SSE Event Types

| Event Type | Payload | Trigger |
|------------|---------|---------|
| `new_order` | Order 객체 | 새 주문 생성 |
| `order_update` | Order 객체 | 주문 상태 변경 |
| `order_delete` | order_id | 주문 삭제 |
| `order_transfer` | {source, target, orders} | 주문 이동 |
| `table_complete` | table_id | 테이블 이용 완료 |
| `heartbeat` | timestamp | 15초마다 연결 유지 |

---

## 5. Transaction Boundaries

| Operation | Transaction Scope |
|-----------|-------------------|
| 주문 생성 | Order + OrderItems + OrderItemOptions |
| 주문 삭제 | Order + OrderItems + OrderItemOptions |
| 테이블 이용 완료 | Orders → OrderHistory 이동 |
| 테이블 주문 이동 | 원본/대상 테이블 주문 업데이트 |
| 메뉴 삭제 | Menu + OptionGroups + Options |
