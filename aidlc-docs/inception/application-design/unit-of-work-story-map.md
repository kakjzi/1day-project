# Unit of Work - Story Mapping

## Story to Unit Mapping

| Story ID | Story Name | Backend | Customer | Admin |
|----------|------------|:-------:|:--------:|:-----:|
| US-01 | 테이블 로그인 | ✓ | ✓ | |
| US-02 | 관리자 로그인 | ✓ | | ✓ |
| US-03 | 관리자 등록 | ✓ | | ✓ |
| US-04 | 메뉴 조회 | ✓ | ✓ | |
| US-05 | 메뉴 관리 | ✓ | | ✓ |
| US-06 | 장바구니 관리 | | ✓ | |
| US-07 | 주문 생성 | ✓ | ✓ | |
| US-08 | 주문 내역 조회 | ✓ | ✓ | |
| US-09 | 실시간 주문 모니터링 | ✓ | | ✓ |
| US-10 | 주문 삭제 | ✓ | | ✓ |
| US-11 | 테이블 이용 완료 | ✓ | | ✓ |
| US-12 | 테이블 간 주문 이동 | ✓ | | ✓ |
| US-13 | 과거 주문 조회 | ✓ | | ✓ |

---

## Unit Summary

### Backend (13 stories)
모든 스토리에 관여 (API 제공)

| 기능 영역 | 스토리 |
|----------|--------|
| 인증 | US-01, US-02, US-03 |
| 메뉴 | US-04, US-05 |
| 주문 | US-07, US-08, US-09, US-10 |
| 테이블 | US-11, US-12, US-13 |

### Customer Frontend (5 stories)

| 기능 영역 | 스토리 |
|----------|--------|
| 인증 | US-01 |
| 메뉴 | US-04 |
| 장바구니 | US-06 |
| 주문 | US-07, US-08 |

### Admin Frontend (8 stories)

| 기능 영역 | 스토리 |
|----------|--------|
| 인증 | US-02, US-03 |
| 메뉴 | US-05 |
| 주문 | US-09, US-10 |
| 테이블 | US-11, US-12, US-13 |

---

## Priority by Unit

### Backend - High Priority Stories
1. US-01 테이블 로그인 (High)
2. US-02 관리자 로그인 (High)
3. US-04 메뉴 조회 (High)
4. US-07 주문 생성 (High)
5. US-09 실시간 주문 모니터링 (High)
6. US-11 테이블 이용 완료 (High)

### Customer Frontend - High Priority Stories
1. US-01 테이블 로그인 (High)
2. US-04 메뉴 조회 (High)
3. US-06 장바구니 관리 (High)
4. US-07 주문 생성 (High)
5. US-08 주문 내역 조회 (High)

### Admin Frontend - High Priority Stories
1. US-02 관리자 로그인 (High)
2. US-05 메뉴 관리 (High)
3. US-09 실시간 주문 모니터링 (High)
4. US-11 테이블 이용 완료 (High)

---

## Development Phases by Unit

### Phase 1: Core (Week 1)
| Unit | Stories |
|------|---------|
| Backend | US-01, US-02, US-04, US-05 |
| Customer | US-01, US-04, US-06 |
| Admin | US-02, US-05 |

### Phase 2: Orders (Week 2)
| Unit | Stories |
|------|---------|
| Backend | US-07, US-08, US-09, US-10 |
| Customer | US-07, US-08 |
| Admin | US-09, US-10 |

### Phase 3: Table Management (Week 3)
| Unit | Stories |
|------|---------|
| Backend | US-03, US-11, US-12, US-13 |
| Customer | - |
| Admin | US-03, US-11, US-12, US-13 |
