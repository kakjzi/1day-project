# Integration Test Instructions

## 목적
Customer Frontend와 Backend API 간의 통합 테스트

## 사전 조건
- Backend 서버 실행 중 (http://localhost:8000)
- 테스트 데이터 준비 (테이블, 메뉴, 카테고리)

## 테스트 시나리오

### 시나리오 1: 로그인 플로우
1. `/login` 페이지 접속
2. 테이블 번호, PIN 입력
3. `POST /api/tables/login` 호출 확인
4. 토큰 저장 및 메뉴 페이지 리다이렉트 확인

### 시나리오 2: 메뉴 조회 플로우
1. 메뉴 페이지 접속
2. `GET /api/menus` 호출 확인
3. 카테고리 탭 표시 확인
4. 메뉴 카드 클릭 → `GET /api/menus/{id}` 호출 확인

### 시나리오 3: 주문 플로우
1. 메뉴 상세에서 옵션 선택 후 담기
2. 장바구니 페이지에서 주문하기 클릭
3. `POST /api/orders` 호출 확인
4. 주문 성공 모달 표시 확인

### 시나리오 4: 주문내역 조회
1. 주문내역 페이지 접속
2. `GET /api/orders` 호출 확인
3. 주문 상태별 표시 확인

## 수동 테스트 절차
```bash
# 1. Backend 실행
cd backend && uvicorn main:app --reload

# 2. Frontend 실행
cd customer-frontend && npm run dev

# 3. 브라우저에서 http://localhost:3000 접속
# 4. 위 시나리오 순서대로 테스트
```

## 예상 결과
- 모든 API 호출 성공 (200 OK)
- UI 상태 정상 업데이트
- 에러 시 Alert 표시
