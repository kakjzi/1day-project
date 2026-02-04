# Customer Frontend Functional Design Plan

## Overview

고객용 프론트엔드 유닛의 상세 기능 설계

## 담당 스토리

- US-01: 테이블 로그인
- US-04: 메뉴 조회
- US-06: 장바구니 관리
- US-07: 주문 생성
- US-08: 주문 내역 조회

## Execution Checklist

### Phase 1: 화면 구조

- [ ] 페이지 구조 정의
- [ ] 컴포넌트 구조 정의

### Phase 2: 상태 관리

- [ ] Context 설계
- [ ] 로컬 스토리지 동기화

### Phase 3: API 연동

- [ ] API 호출 함수 정의

---

## Questions

### Question 1

메뉴 상세 표시 방식: 메뉴 클릭 시 상세 정보를 어떻게 표시할까요?

A) 모달/다이얼로그 (현재 화면 위에 팝업)
B) 새 페이지로 이동 (/menu/{id})
C) 사이드 패널 (오른쪽에서 슬라이드)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2

장바구니 표시 위치: 장바구니를 어디에 표시할까요?

A) 하단 고정 바 (아이템 수 + 총액 표시, 클릭 시 장바구니 페이지)
B) 우측 사이드바 (항상 표시)
C) 별도 페이지만 (/cart)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3

카테고리 네비게이션: 카테고리 이동을 어떻게 할까요?

A) 상단 탭 (가로 스크롤)
B) 좌측 사이드바 (세로 목록)
C) 상단 드롭다운
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4

주문 완료 후 화면: 주문 성공 시 어떻게 표시할까요?

A) 성공 모달 (5초 후 자동 닫힘) → 메뉴 화면 유지
B) 성공 페이지로 이동 → 5초 후 메뉴로 리다이렉트
C) 토스트 메시지만 표시
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5

옵션 선택 UI: 메뉴 옵션 선택을 어떻게 표시할까요?

A) 라디오 버튼 (단일 선택) / 체크박스 (다중 선택)
B) 버튼 그룹 (선택 시 하이라이트)
C) 드롭다운 선택
D) Other (please describe after [Answer]: tag below)

[Answer]: D, 현재 Trend에 맞춰서 UI/UX 경험 좋게 해줘

---

### Question 6

수량 조절 UI: 장바구니에서 수량 조절을 어떻게 할까요?

A) +/- 버튼 (숫자 표시)
B) 숫자 입력 필드
C) 스테퍼 (MUI Stepper)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---
