# Application Components

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
├─────────────────────────┬───────────────────────────────────┤
│   Customer Frontend     │       Admin Frontend              │
│   (Next.js + MUI)       │       (Next.js + MUI)             │
│   Port: 3000            │       Port: 3001                  │
└───────────┬─────────────┴───────────────┬───────────────────┘
            │                             │
            │         HTTP/SSE            │
            └──────────────┬──────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend API                               │
│                  (FastAPI + SQLAlchemy)                      │
│                    Port: 8000                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      MySQL Database                          │
│                      Port: 3306                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Backend Components (FastAPI)

### 1.1 Directory Structure
```
backend/
├── main.py                 # FastAPI 앱 진입점
├── config.py               # 설정 (DB, JWT 등)
├── database.py             # DB 연결 설정
├── models/                 # SQLAlchemy 모델
│   ├── __init__.py
│   ├── store.py
│   ├── admin.py
│   ├── table.py
│   ├── category.py
│   ├── menu.py
│   ├── option.py
│   └── order.py
├── schemas/                # Pydantic 스키마
│   ├── __init__.py
│   ├── auth.py
│   ├── menu.py
│   ├── order.py
│   └── table.py
├── routes/                 # API 라우터
│   ├── __init__.py
│   ├── auth.py
│   ├── menu.py
│   ├── order.py
│   ├── table.py
│   └── admin.py
├── services/               # 비즈니스 로직
│   ├── __init__.py
│   ├── auth_service.py
│   ├── menu_service.py
│   ├── order_service.py
│   └── table_service.py
├── utils/                  # 유틸리티
│   ├── __init__.py
│   ├── security.py         # JWT, bcrypt
│   └── sse.py              # SSE 이벤트 관리
└── seed_data.py            # 샘플 데이터
```

### 1.2 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **models/** | DB 테이블 정의 (SQLAlchemy ORM) |
| **schemas/** | 요청/응답 데이터 검증 (Pydantic) |
| **routes/** | HTTP 엔드포인트 정의 |
| **services/** | 비즈니스 로직 처리 |
| **utils/** | 공통 유틸리티 (인증, SSE) |

---

## 2. Customer Frontend Components (Next.js)

### 2.1 Directory Structure
```
customer-frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 메뉴 화면 (기본)
│   │   ├── cart/
│   │   │   └── page.tsx        # 장바구니
│   │   ├── orders/
│   │   │   └── page.tsx        # 주문 내역
│   │   └── login/
│   │       └── page.tsx        # 테이블 로그인 (초기 설정)
│   ├── components/
│   │   ├── MenuCard.tsx
│   │   ├── MenuDetail.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderStatus.tsx
│   │   └── CategoryTabs.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx     # 테이블 인증 상태
│   │   └── CartContext.tsx     # 장바구니 상태
│   ├── services/
│   │   └── api.ts              # API 호출 함수
│   └── types/
│       └── index.ts            # TypeScript 타입
└── package.json
```

### 2.2 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **app/** | 페이지 라우팅 |
| **components/** | 재사용 UI 컴포넌트 |
| **contexts/** | 전역 상태 관리 (Auth, Cart) |
| **services/** | API 통신 |
| **types/** | TypeScript 타입 정의 |

---

## 3. Admin Frontend Components (Next.js)

### 3.1 Directory Structure
```
admin-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 대시보드 (주문 모니터링)
│   │   ├── login/
│   │   │   └── page.tsx        # 관리자 로그인
│   │   ├── menus/
│   │   │   └── page.tsx        # 메뉴 관리
│   │   ├── tables/
│   │   │   └── page.tsx        # 테이블 관리
│   │   └── history/
│   │       └── page.tsx        # 과거 주문 조회
│   ├── components/
│   │   ├── TableCard.tsx       # 테이블별 주문 카드
│   │   ├── OrderDetail.tsx     # 주문 상세 모달
│   │   ├── MenuForm.tsx        # 메뉴 등록/수정 폼
│   │   ├── OptionGroupForm.tsx # 옵션 그룹 관리
│   │   └── StatusButton.tsx    # 상태 변경 버튼
│   ├── contexts/
│   │   └── AuthContext.tsx     # 관리자 인증 상태
│   ├── services/
│   │   ├── api.ts              # API 호출 함수
│   │   └── sse.ts              # SSE 연결 관리
│   └── types/
│       └── index.ts
└── package.json
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **app/** | 페이지 라우팅 |
| **components/** | 관리자 UI 컴포넌트 |
| **contexts/** | 관리자 인증 상태 |
| **services/** | API 통신 + SSE 연결 |
| **types/** | TypeScript 타입 정의 |

---

## 4. Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Backend Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | MySQL |
| Frontend Framework | Next.js 14 (App Router) |
| UI Library | MUI (Material UI) |
| State Management | React Context API |
| API Communication | fetch API |
| Real-time | Server-Sent Events (SSE) |
| Authentication | JWT (localStorage) |
| Password Hashing | bcrypt |
