# Customer Frontend NFR Requirements Plan

## Overview

고객용 프론트엔드의 비기능 요구사항 정의

## Execution Checklist

### Phase 1: Performance

- [ ] 로딩 성능 요구사항
- [ ] 렌더링 성능 요구사항

### Phase 2: Usability

- [ ] 접근성 요구사항
- [ ] 반응형 디자인 요구사항

### Phase 3: Reliability

- [ ] 오프라인 지원
- [ ] 에러 처리

---

## Questions

### Question 1

초기 로딩 시간: 첫 페이지 로딩 목표 시간은?

A) 1초 이내 (매우 빠름 - SSR/SSG 필수)
B) 2초 이내 (빠름 - 일반적인 목표)
C) 3초 이내 (보통 - MVP 수준)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 2

이미지 최적화: 메뉴 이미지 로딩을 어떻게 처리할까요?

A) Next.js Image 컴포넌트 (자동 최적화, lazy loading)
B) 일반 img 태그 (단순, 최적화 없음)
C) 외부 CDN + lazy loading
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3

오프라인 지원: 네트워크 끊김 시 어떻게 처리할까요?

A) 오프라인 미지원 (에러 메시지만 표시)
B) 장바구니만 오프라인 유지 (localStorage)
C) PWA로 메뉴 캐싱 + 오프라인 장바구니
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4

반응형 디자인: 어떤 화면 크기를 지원할까요?

A) 태블릿 전용 (768px ~ 1024px)
B) 태블릿 + 모바일 (320px ~ 1024px)
C) 모든 화면 크기 (반응형)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5

접근성(A11y): 접근성 수준은?

A) 기본 (시맨틱 HTML, alt 텍스트)
B) WCAG 2.1 AA 준수
C) MVP에서는 고려하지 않음
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 6

에러 바운더리: React 에러 처리를 어떻게 할까요?

A) 전역 에러 바운더리 (앱 크래시 방지)
B) 페이지별 에러 바운더리
C) 에러 바운더리 없음 (기본 동작)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---
