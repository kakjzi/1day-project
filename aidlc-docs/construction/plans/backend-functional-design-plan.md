# Backend Functional Design Plan

## Overview

백엔드 유닛의 상세 비즈니스 로직 설계

## Execution Checklist

### Phase 1: Domain Entities

- [ ] 핵심 엔티티 상세 정의
- [ ] 엔티티 관계 다이어그램

### Phase 2: Business Rules

- [ ] 인증 비즈니스 규칙
- [ ] 주문 비즈니스 규칙
- [ ] 테이블 세션 비즈니스 규칙

### Phase 3: Business Logic

- [ ] 주문 생성 로직
- [ ] 주문 상태 전이 로직
- [ ] 테이블 이동/완료 로직

---

## Questions

### Question 1

주문 번호 표시: 고객에게 보여주는 주문 번호는 어떤 형식이 좋을까요?

A) DB ID 그대로 (1, 2, 3, ...)
B) 당일 순번 (오늘의 1번, 2번, ... - 매일 리셋)
C) 테이블+순번 (3-1, 3-2 = 테이블3의 1번째, 2번째 주문)
D) Other (please describe after [Answer]: tag below)

[Answer]: C, 일자별로 순번 초기화

---

### Question 2

장바구니 서버 저장: 장바구니를 서버에도 저장할까요?

A) 아니오, 클라이언트(localStorage)에만 저장 (현재 설계)
B) 예, 서버에도 저장 (테이블 이동 시 장바구니도 이동 가능)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3

주문 취소 기능: 고객이 주문 후 취소할 수 있나요?

A) 아니오, 고객은 취소 불가 (관리자만 삭제 가능)
B) 예, PENDING 상태일 때만 고객이 취소 가능
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4

메뉴 품절 처리: 메뉴 품절 상태를 관리할까요?

A) 아니오, MVP에서는 품절 기능 없음
B) 예, 메뉴별 품절 플래그 추가 (품절 시 주문 불가)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 5

옵션 필수 선택: 필수 옵션을 선택하지 않으면 어떻게 처리할까요?

A) 프론트엔드에서만 검증 (서버는 신뢰)
B) 서버에서도 필수 옵션 검증 (이중 검증)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6

동시 주문 처리: 같은 테이블에서 동시에 여러 주문이 들어오면?

A) 모두 허용 (각각 별도 주문으로 처리)
B) 순차 처리 (락 사용)
C) Other (please describe after [Answer]: tag below)

[Answer]:
