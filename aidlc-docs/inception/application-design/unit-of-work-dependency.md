# Unit of Work Dependencies

## Dependency Matrix

| From \ To | Backend | Customer Frontend | Admin Frontend |
|-----------|:-------:|:-----------------:|:--------------:|
| **Backend** | - | - | - |
| **Customer Frontend** | ✓ HTTP | - | - |
| **Admin Frontend** | ✓ HTTP + SSE | - | - |

---

## Dependency Details

### Customer Frontend → Backend

| 의존성 | 타입 | 엔드포인트 |
|--------|------|-----------|
| 테이블 로그인 | HTTP POST | `/api/tables/login` |
| 메뉴 조회 | HTTP GET | `/api/menus`, `/api/categories` |
| 주문 생성 | HTTP POST | `/api/orders` |
| 주문 내역 | HTTP GET | `/api/orders` |

### Admin Frontend → Backend

| 의존성 | 타입 | 엔드포인트 |
|--------|------|-----------|
| 관리자 로그인 | HTTP POST | `/api/admin/login` |
| 관리자 등록 | HTTP POST | `/api/admin/register` |
| 실시간 주문 | SSE | `/api/admin/orders/stream` |
| 주문 상태 변경 | HTTP PATCH | `/api/admin/orders/{id}/status` |
| 주문 삭제 | HTTP DELETE | `/api/admin/orders/{id}` |
| 테이블 관리 | HTTP | `/api/admin/tables/*` |
| 메뉴 관리 | HTTP | `/api/admin/menus/*`, `/api/admin/categories/*` |

---

## Communication Patterns

### 1. REST API (HTTP)
- 모든 CRUD 작업
- 요청-응답 패턴
- JSON 데이터 형식

### 2. Server-Sent Events (SSE)
- 관리자 대시보드 실시간 업데이트
- 단방향 (서버 → 클라이언트)
- 이벤트: `new_order`, `order_update`, `order_delete`, `heartbeat`

---

## Dependency Diagram

```
┌─────────────────────┐
│   Customer Frontend │
│      (Port 3000)    │
└──────────┬──────────┘
           │
           │ HTTP REST
           │
           ▼
┌─────────────────────┐
│      Backend        │◄────────────┐
│     (Port 8000)     │             │
└──────────┬──────────┘             │
           │                        │
           │ SQL                    │ HTTP REST + SSE
           │                        │
           ▼                        │
┌─────────────────────┐   ┌────────┴────────────┐
│       MySQL         │   │   Admin Frontend    │
│     (Port 3306)     │   │     (Port 3001)     │
└─────────────────────┘   └─────────────────────┘
```

---

## Build Order

동시 개발이지만, 통합 테스트 시 순서:

1. **Backend** - API 서버 실행
2. **MySQL** - 데이터베이스 실행 (Docker 또는 로컬)
3. **Customer Frontend** - 고객 UI 실행
4. **Admin Frontend** - 관리자 UI 실행

### 실행 명령어 (예상)

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Customer Frontend
cd customer-frontend
npm install
npm run dev  # Port 3000

# Terminal 3: Admin Frontend
cd admin-frontend
npm install
npm run dev -- -p 3001  # Port 3001
```
