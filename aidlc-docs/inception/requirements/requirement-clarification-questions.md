# Requirements Clarification Questions (Follow-up)

이전 답변을 바탕으로 추가 명확화가 필요한 사항입니다.
각 질문에 대해 [Answer]: 태그 뒤에 선택한 옵션의 알파벳을 입력해주세요.

---

## Question 1

S3 이미지 업로드: 클라우드 스토리지(S3)를 선택하셨는데, 현재 AWS 계정이 있고 S3 버킷 설정이 가능합니까?

A) 예, AWS 계정 있고 S3 사용 가능
B) 아니오, 일단 로컬 파일 저장으로 대체하고 나중에 S3로 전환
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2

다국어 지원 범위: 한국어 기본 + 영어 지원을 선택하셨는데, MVP 단계에서 다국어 구조를 어느 수준까지 구현할까요?

A) MVP에서는 한국어만, 다국어 구조만 준비 (영어 번역은 나중에)
B) MVP에서 한국어 + 영어 모두 완전 지원
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

실시간 주문 알림: SSE(Server-Sent Events)로 실시간 주문 모니터링을 구현하는데, 관리자 화면에서 새 주문 시 소리 알림이 필요합니까?

A) 예, 브라우저 소리 알림 필요
B) 아니오, 시각적 알림(색상 변경, 애니메이션)만으로 충분
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

테이블 태블릿 인증: 테이블 비밀번호는 어떤 형태로 설정하시겠습니까?

A) 간단한 4자리 숫자 PIN
B) 영문+숫자 조합 비밀번호
C) 관리자가 자유롭게 설정 (형식 제한 없음)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

주문 상태 관리: 주문 상태는 몇 단계로 관리하시겠습니까?

A) 3단계 (대기중 → 준비중 → 완료)
B) 2단계 (대기중 → 완료)
C) 4단계 이상 (대기중 → 접수 → 준비중 → 완료)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 6

메뉴 옵션/추가 선택: 메뉴에 옵션 선택 기능이 필요합니까? (예: 맵기 조절, 사이드 추가, 토핑 선택 등)

A) 예, 메뉴별 옵션 선택 기능 필요
B) 아니오, MVP에서는 단순 메뉴 선택만
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

카테고리 구조: 메뉴 카테고리는 어떤 구조로 하시겠습니까?

A) 1단계 카테고리만 (예: 메인, 사이드, 음료)
B) 2단계 카테고리 (예: 음료 > 커피, 음료 > 주스)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

관리자 계정: 관리자 계정은 어떻게 생성하시겠습니까?

A) 시스템 초기화 시 기본 관리자 계정 자동 생성
B) 별도의 관리자 등록 API/화면 제공
C) 데이터베이스에 직접 삽입 (개발 단계)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---
