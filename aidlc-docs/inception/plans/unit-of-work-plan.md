# Unit of Work Plan

## Overview

테이블오더 서비스를 개발 단위로 분해

## Execution Checklist

### Phase 1: Unit Definition

- [ ] 유닛 식별 및 정의
- [ ] 유닛별 책임 범위 정의

### Phase 2: Dependencies

- [ ] 유닛 간 의존성 매트릭스 작성

### Phase 3: Story Mapping

- [ ] 스토리-유닛 매핑

---

## Questions

### Question 1

개발 단위 분리: 시스템을 어떻게 분리하시겠습니까?

A) 단일 유닛 - 백엔드 1개 + 프론트엔드 2개를 하나의 개발 단위로
B) 3개 유닛 - 백엔드, 고객 프론트엔드, 관리자 프론트엔드 각각 분리
C) 기능별 유닛 - 인증, 메뉴, 주문, 테이블 등 기능별로 분리
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2

개발 순서: 어떤 순서로 개발을 진행하시겠습니까?

A) 백엔드 먼저 → 프론트엔드 (API 완성 후 UI 개발)
B) 기능별 수직 개발 (로그인 전체 → 메뉴 전체 → 주문 전체)
C) 동시 개발 (백엔드/프론트엔드 병렬 진행)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 3

프론트엔드 공통 코드: 고객용과 관리자용 프론트엔드 간 공통 코드를 어떻게 관리하시겠습니까?

A) 공유 없음 - 각각 독립적으로 개발
B) 공통 타입/유틸만 공유 (shared/ 폴더)
C) 모노레포 구조 (packages/shared, packages/customer, packages/admin)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---
