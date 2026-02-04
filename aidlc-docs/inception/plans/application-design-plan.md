# Application Design Plan

## Overview

테이블오더 서비스의 애플리케이션 컴포넌트 설계

## Execution Checklist

### Phase 1: Component Design

- [ ] 백엔드 컴포넌트 정의
- [ ] 고객용 프론트엔드 컴포넌트 정의
- [ ] 관리자용 프론트엔드 컴포넌트 정의

### Phase 2: Method Signatures

- [ ] API 엔드포인트 메서드 정의
- [ ] 서비스 레이어 메서드 정의

### Phase 3: Dependencies

- [ ] 컴포넌트 간 의존성 정의
- [ ] 데이터 흐름 정의

---

## Questions

### Question 1

백엔드 코드 구조: 어떤 구조로 백엔드를 구성하시겠습니까?

A) 기능별 분리 (auth/, menu/, order/, table/ 폴더)
B) 레이어별 분리 (models/, routes/, services/ 폴더)
C) 도메인 주도 설계 (domain/, application/, infrastructure/)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2

프론트엔드 상태 관리: Next.js에서 상태 관리를 어떻게 하시겠습니까?

A) React Context API (단순, 내장)
B) Zustand (경량, 간단한 API)
C) Redux Toolkit (강력, 복잡)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

API 통신 라이브러리: 프론트엔드에서 API 호출에 무엇을 사용하시겠습니까?

A) fetch API (내장, 단순)
B) Axios (인터셉터, 에러 처리 편리)
C) TanStack Query + fetch (캐싱, 자동 리페치)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4

CSS 스타일링: 프론트엔드 스타일링 방식은 무엇을 사용하시겠습니까?

A) Tailwind CSS (유틸리티 클래스, 빠른 개발)
B) CSS Modules (컴포넌트별 스코프)
C) styled-components (CSS-in-JS)
D) Chakra UI / MUI (컴포넌트 라이브러리)
E) Other (please describe after [Answer]: tag below)

[Answer]: D, MUI로 진행

---

### Question 5

데이터베이스 ORM: FastAPI에서 MySQL 접근에 무엇을 사용하시겠습니까?

A) SQLAlchemy (풀 ORM, 성숙함)
B) Tortoise ORM (async 네이티브)
C) SQLModel (FastAPI 제작자가 만듦, SQLAlchemy 기반)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6

인증 토큰 저장: 프론트엔드에서 JWT 토큰을 어디에 저장하시겠습니까?

A) localStorage (간단, XSS 취약)
B) httpOnly Cookie (보안 강화, CSRF 고려 필요)
C) 메모리 + Refresh Token (보안 최상, 구현 복잡)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7

이미지 업로드 처리: 메뉴 이미지 업로드 시 파일 크기 제한은?

A) 1MB 이하
B) 5MB 이하
C) 10MB 이하
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8

에러 처리 방식: API 에러 응답 형식은 어떻게 하시겠습니까?

A) HTTP 상태 코드 + 간단한 메시지 ({"error": "message"})
B) 상세 에러 객체 ({"code": "ERR001", "message": "...", "details": {...}})
C) RFC 7807 Problem Details 표준
D) Other (please describe after [Answer]: tag below)

[Answer]: B
