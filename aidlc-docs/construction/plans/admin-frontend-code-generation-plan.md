# Admin Frontend Code Generation Plan

## Unit Information
- **Unit Name**: admin-frontend
- **기술 스택**: Next.js 14, React, MUI, TypeScript
- **포트**: 3001
- **위치**: `admin-frontend/`

## 담당 User Stories
- US-02: 관리자 로그인
- US-03: 관리자 등록
- US-05: 메뉴 관리
- US-09: 실시간 주문 모니터링
- US-10: 주문 삭제
- US-11: 테이블 이용 완료
- US-12: 테이블 간 주문 이동
- US-13: 과거 주문 조회

---

## Code Generation Steps

### Phase 1: 프로젝트 설정
- [x] Step 1: Next.js 프로젝트 초기화 및 의존성 설치
- [x] Step 2: TypeScript 타입 정의 (`src/types/index.ts`)
- [x] Step 3: 환경 설정 파일 (`.env.local`, `next.config.js`)

### Phase 2: 공통 인프라
- [x] Step 4: API 서비스 (`src/services/api.ts`)
- [x] Step 5: SSE 서비스 (`src/services/sse.ts`)
- [x] Step 6: 인증 Context (`src/contexts/AuthContext.tsx`)

### Phase 3: 레이아웃 및 공통 컴포넌트
- [x] Step 7: 루트 레이아웃 (`src/app/layout.tsx`)
- [x] Step 8: 공통 컴포넌트 - ConfirmDialog, StatusChip, LoadingSpinner

### Phase 4: 인증 페이지 (US-02, US-03)
- [x] Step 9: 로그인 페이지 (`src/app/login/page.tsx`)
- [x] Step 10: 관리자 등록 페이지 (`src/app/register/page.tsx`)

### Phase 5: 대시보드 - 주문 모니터링 (US-09, US-10)
- [x] Step 11: 대시보드 페이지 (`src/app/page.tsx`)
- [x] Step 12: TableCard 컴포넌트 (`src/components/TableCard.tsx`)
- [x] Step 13: OrderDetailModal 컴포넌트 (`src/components/OrderDetailModal.tsx`)

### Phase 6: 테이블 관리 (US-11, US-12, US-13)
- [x] Step 14: 테이블 관리 페이지 (`src/app/tables/page.tsx`)
- [x] Step 15: TableTransferModal 컴포넌트 (`src/components/TableTransferModal.tsx`)
- [x] Step 16: OrderHistoryModal 컴포넌트 (`src/components/OrderHistoryModal.tsx`)

### Phase 7: 메뉴 관리 (US-05)
- [x] Step 17: 메뉴 관리 페이지 (`src/app/menus/page.tsx`)
- [x] Step 18: MenuForm 컴포넌트 (`src/components/MenuForm.tsx`)
- [x] Step 19: OptionGroupForm 컴포넌트 (`src/components/OptionGroupForm.tsx`)
- [x] Step 20: CategoryManagement 컴포넌트 (`src/components/CategoryManagement.tsx`)

### Phase 8: 마무리
- [x] Step 21: 네비게이션 및 라우팅 보호
- [x] Step 22: README.md 작성

---

## 디렉토리 구조

```
admin-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 대시보드
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── tables/
│   │   │   └── page.tsx
│   │   └── menus/
│   │       └── page.tsx
│   ├── components/
│   │   ├── TableCard.tsx
│   │   ├── OrderDetailModal.tsx
│   │   ├── TableTransferModal.tsx
│   │   ├── OrderHistoryModal.tsx
│   │   ├── MenuForm.tsx
│   │   ├── OptionGroupForm.tsx
│   │   ├── CategoryManagement.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── StatusChip.tsx
│   │   └── LoadingSpinner.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── sse.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Story Traceability

| Step | User Story | 설명 |
|------|------------|------|
| 9, 10 | US-02, US-03 | 인증 (로그인, 등록) |
| 11-13 | US-09, US-10 | 주문 모니터링, 삭제 |
| 14-16 | US-11, US-12, US-13 | 테이블 관리 |
| 17-20 | US-05 | 메뉴 관리 |

---

## 총 22개 Step
