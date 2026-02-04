# Unit of Work Definition

## Overview

테이블오더 서비스는 **3개의 독립적인 유닛**으로 구성됩니다.

---

## Unit 1: Backend API

| 항목 | 내용 |
|------|------|
| **이름** | `backend` |
| **기술 스택** | Python, FastAPI, SQLAlchemy, MySQL |
| **포트** | 8000 |
| **책임** | REST API, 비즈니스 로직, 데이터베이스, SSE |

### 디렉토리 구조
```
backend/
├── main.py
├── config.py
├── database.py
├── models/
├── schemas/
├── routes/
├── services/
├── utils/
├── seed_data.py
└── requirements.txt
```

### 주요 기능
- 테이블/관리자 인증 (JWT)
- 메뉴 및 카테고리 CRUD
- 주문 생성 및 상태 관리
- 테이블 세션 관리
- SSE 실시간 이벤트

---

## Unit 2: Customer Frontend

| 항목 | 내용 |
|------|------|
| **이름** | `customer-frontend` |
| **기술 스택** | Next.js, React, MUI, TypeScript |
| **포트** | 3000 |
| **책임** | 고객용 주문 UI |

### 디렉토리 구조
```
customer-frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── services/
│   └── types/
├── public/
├── package.json
└── tsconfig.json
```

### 주요 기능
- 테이블 로그인 (초기 설정)
- 메뉴 조회 및 탐색
- 장바구니 관리
- 주문 생성
- 주문 내역 조회

---

## Unit 3: Admin Frontend

| 항목 | 내용 |
|------|------|
| **이름** | `admin-frontend` |
| **기술 스택** | Next.js, React, MUI, TypeScript |
| **포트** | 3001 |
| **책임** | 관리자용 매장 관리 UI |

### 디렉토리 구조
```
admin-frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── services/
│   └── types/
├── public/
├── package.json
└── tsconfig.json
```

### 주요 기능
- 관리자 로그인/등록
- 실시간 주문 모니터링 (SSE)
- 주문 상태 변경
- 테이블 관리 (이용 완료, 주문 이동)
- 메뉴/카테고리/옵션 관리

---

## Development Strategy

### 개발 순서
**동시 개발 (병렬 진행)**

```
Week 1:
├── Backend: DB 스키마 + 인증 API + 메뉴 API
├── Customer Frontend: 프로젝트 설정 + 로그인 + 메뉴 조회
└── Admin Frontend: 프로젝트 설정 + 로그인

Week 2:
├── Backend: 주문 API + SSE + 테이블 API
├── Customer Frontend: 장바구니 + 주문 + 주문 내역
└── Admin Frontend: 대시보드 + SSE 연결 + 메뉴 관리

Week 3:
├── Backend: 테이블 이동 + 과거 주문 + 샘플 데이터
├── Customer Frontend: UI 완성 + 테스트
└── Admin Frontend: 테이블 관리 + UI 완성 + 테스트
```

### 코드 공유
**공유 없음** - 각 프론트엔드 독립 개발
- 타입 정의: 각 프로젝트에서 별도 정의
- API 클라이언트: 각 프로젝트에서 별도 구현
- 이유: MVP 규모에서 중복 최소화보다 빠른 개발 우선

---

## Project Root Structure

```
table-order/
├── backend/                 # Unit 1
├── customer-frontend/       # Unit 2
├── admin-frontend/          # Unit 3
├── aidlc-docs/              # 문서
└── README.md
```
