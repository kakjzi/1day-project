# Admin Frontend Functional Design Plan

## Unit Information
- **Unit Name**: admin-frontend
- **기술 스택**: Next.js, React, MUI, TypeScript
- **포트**: 3001
- **책임**: 관리자용 매장 관리 UI

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

## Functional Design Plan

### Phase 1: 도메인 모델 정의
- [x] 1.1 Admin Frontend 타입 정의 (TypeScript interfaces)
- [x] 1.2 API 응답 타입 정의
- [x] 1.3 상태 관리 타입 정의

### Phase 2: 비즈니스 로직 모델
- [x] 2.1 인증 로직 (로그인, 등록, 세션 관리)
- [x] 2.2 주문 모니터링 로직 (SSE 연결, 실시간 업데이트)
- [x] 2.3 주문 관리 로직 (상태 변경, 삭제)
- [x] 2.4 테이블 관리 로직 (이용 완료, 주문 이동)
- [x] 2.5 메뉴 관리 로직 (CRUD, 옵션 관리)

### Phase 3: 비즈니스 규칙 정의
- [x] 3.1 인증 규칙 (세션 만료, 토큰 검증)
- [x] 3.2 주문 상태 전이 규칙
- [x] 3.3 주문 삭제 규칙 (완료 상태 제외)
- [x] 3.4 테이블 이동 규칙
- [x] 3.5 입력 검증 규칙

---

## Clarification Questions

아래 질문에 답변해주세요. [Answer]: 태그 뒤에 선택지 문자를 입력하세요.

### Question 1
주문 상태 변경 시 확인 팝업이 필요한가요?

A) 모든 상태 변경에 확인 팝업 표시
B) 특정 상태 변경만 확인 (예: 완료 처리 시만)
C) 확인 팝업 없이 즉시 변경
D) Other (please describe after [Answer]: tag below)

[Answer]: c

---

### Question 2
신규 주문 알림 소리는 어떻게 처리할까요?

A) 브라우저 기본 알림음 사용
B) 커스텀 알림음 파일 사용
C) 소리 알림 없이 시각적 강조만
D) 사용자가 설정에서 선택 가능
E) Other (please describe after [Answer]: tag below)

[Answer]: a

---

### Question 3
대시보드 테이블 카드 레이아웃은?

A) 고정 그리드 (예: 4열)
B) 반응형 그리드 (화면 크기에 따라 조절)
C) 리스트 형태
D) Other (please describe after [Answer]: tag below)

[Answer]: b

---

### Question 4
메뉴 이미지 업로드 시 미리보기가 필요한가요?

A) 업로드 전 미리보기 필수
B) 업로드 후 썸네일만 표시
C) 미리보기 없이 URL만 표시
D) Other (please describe after [Answer]: tag below)

[Answer]: a

---

### Question 5
관리자 등록 시 추가 검증이 필요한가요?

A) 기존 관리자 승인 필요
B) 이메일 인증 필요
C) 별도 검증 없이 바로 등록
D) Other (please describe after [Answer]: tag below)

[Answer]: c

---

### Question 6
테이블 카드에 표시할 최근 주문 개수는?

A) 최근 3개
B) 최근 5개
C) 모든 주문 (스크롤)
D) 사용자 설정 가능
E) Other (please describe after [Answer]: tag below)

[Answer]: b

---

### Question 7
과거 주문 조회 시 기본 날짜 범위는?

A) 오늘만
B) 최근 7일
C) 최근 30일
D) 전체 기간
E) Other (please describe after [Answer]: tag below)

[Answer]: a

---

**답변 완료 후 알려주세요!**
