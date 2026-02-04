# Business Rules - Backend

## 1. 인증 규칙

### BR-AUTH-01: 테이블 로그인
- 매장 ID + 테이블 번호 + 4자리 PIN으로 인증
- 인증 성공 시 JWT 토큰 발급
- 토큰에 store_id, table_id, session_id 포함

### BR-AUTH-02: 관리자 로그인
- 매장 ID + 사용자명 + 비밀번호로 인증
- 비밀번호는 bcrypt 해싱
- 16시간 세션 유지
- 세션 만료 시 재로그인 필요

### BR-AUTH-03: 로그인 시도 제한
- 5회 연속 실패 시 5분간 로그인 차단
- IP 기반 또는 계정 기반 제한

---

## 2. 메뉴 규칙

### BR-MENU-01: 품절 처리
- `is_sold_out = true`인 메뉴는 고객 화면에 "품절" 표시
- 품절 메뉴는 장바구니 추가 불가
- 관리자만 품절 상태 변경 가능

### BR-MENU-02: 이미지 업로드
- 최대 파일 크기: 1MB
- 허용 형식: jpg, jpeg, png, gif, webp
- 저장 경로: `/uploads/menus/{store_id}/{filename}`

### BR-MENU-03: 카테고리 삭제
- 카테고리에 메뉴가 있으면 삭제 불가
- 또는 해당 메뉴를 "미분류"로 이동 후 삭제

---

## 3. 장바구니 규칙

### BR-CART-01: 서버 저장
- 장바구니는 테이블별로 서버에 저장
- 클라이언트 localStorage와 동기화
- 테이블 이동 시 장바구니도 함께 이동

### BR-CART-02: 품절 메뉴 처리
- 장바구니에 담긴 메뉴가 품절되면 주문 시 에러
- 에러 메시지: "품절된 메뉴가 포함되어 있습니다: {메뉴명}"

### BR-CART-03: 장바구니 초기화
- 주문 완료 시 해당 테이블 장바구니 자동 삭제
- 테이블 이용 완료 시 장바구니 자동 삭제

---

## 4. 주문 규칙

### BR-ORDER-01: 주문 번호 생성
- 형식: `{테이블번호}-{당일순번}`
- 예: 테이블 3번의 첫 번째 주문 → "3-1"
- 당일 순번은 매일 자정에 리셋 (last_order_date 비교)

```python
def generate_display_number(table):
    today = date.today()
    if table.last_order_date != today:
        table.daily_order_count = 0
        table.last_order_date = today
    table.daily_order_count += 1
    return f"{table.table_number}-{table.daily_order_count}"
```

### BR-ORDER-02: 주문 생성
- 장바구니 내용을 주문으로 변환
- 세션 ID가 없으면 새 세션 시작
- 주문 생성 시 SSE 이벤트 발행 (`new_order`)

### BR-ORDER-03: 주문 상태 전이
```
PENDING → ACCEPTED → PREPARING → COMPLETED
   │
   └──→ (삭제 가능)
```
- 상태는 순방향으로만 전이 가능
- COMPLETED 상태에서는 삭제 불가
- 상태 변경 시 SSE 이벤트 발행 (`order_update`)

### BR-ORDER-04: 주문 삭제
- PENDING, ACCEPTED, PREPARING 상태에서만 삭제 가능
- COMPLETED 상태는 삭제 불가 (이력 보존)
- 삭제 시 SSE 이벤트 발행 (`order_delete`)

### BR-ORDER-05: 고객 주문 취소
- 고객은 주문 취소 불가
- 취소가 필요하면 관리자에게 요청

---

## 5. 테이블 세션 규칙

### BR-TABLE-01: 세션 시작
- 첫 주문 생성 시 자동으로 세션 시작
- session_id = UUID 생성
- session_started_at = 현재 시각

### BR-TABLE-02: 세션 종료 (이용 완료)
- 관리자가 "이용 완료" 버튼 클릭
- 현재 세션의 모든 주문을 OrderHistory로 복사
- 테이블 리셋: session_id = null, daily_order_count 유지
- 장바구니 삭제
- SSE 이벤트 발행 (`table_complete`)

### BR-TABLE-03: 테이블 주문 이동
- 원본 테이블의 모든 주문을 대상 테이블로 이동
- 장바구니도 함께 이동
- 원본 테이블 세션 리셋
- 대상 테이블에 세션이 없으면 새 세션 시작
- SSE 이벤트 발행 (`order_transfer`)

### BR-TABLE-04: 주문 조회 범위
- 고객: 현재 세션(session_id)의 주문만 조회
- 관리자: 모든 활성 주문 조회 (COMPLETED 제외 옵션)

---

## 6. 에러 코드

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_001 | 401 | 잘못된 인증 정보 |
| AUTH_002 | 401 | 토큰 만료 |
| AUTH_003 | 403 | 권한 없음 |
| AUTH_004 | 429 | 로그인 시도 초과 |
| MENU_001 | 404 | 메뉴 없음 |
| MENU_002 | 400 | 품절된 메뉴 |
| MENU_003 | 400 | 카테고리에 메뉴 존재 (삭제 불가) |
| ORDER_001 | 404 | 주문 없음 |
| ORDER_002 | 400 | 완료된 주문 삭제 불가 |
| ORDER_003 | 400 | 잘못된 상태 전이 |
| TABLE_001 | 404 | 테이블 없음 |
| TABLE_002 | 400 | 잘못된 테이블 작업 |
| FILE_001 | 400 | 파일 크기 초과 (1MB) |
| FILE_002 | 400 | 지원하지 않는 파일 형식 |
