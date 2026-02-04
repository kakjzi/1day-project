# Customer Frontend - NFR Requirements

## 1. Performance Requirements

| 항목 | 요구사항 | 측정 방법 |
|------|----------|----------|
| 초기 로딩 | 3초 이내 | First Contentful Paint (FCP) |
| 페이지 전환 | 1초 이내 | 클라이언트 라우팅 |
| API 응답 표시 | 2초 이내 | 로딩 스피너 표시 후 데이터 렌더링 |

### 이미지 처리
- 일반 `<img>` 태그 사용
- 서버에서 업로드 시 1MB 제한으로 크기 관리
- 필요 시 CSS로 크기 조절

---

## 2. Usability Requirements

### 반응형 디자인
- **지원 범위**: 태블릿 전용 (768px ~ 1024px)
- **최적화 해상도**: 1024 x 768 (가로 모드)
- 모바일/데스크톱은 MVP 범위 외

### 접근성 (A11y)
- **수준**: 기본
- 시맨틱 HTML 태그 사용 (`<nav>`, `<main>`, `<button>` 등)
- 이미지에 `alt` 텍스트 제공
- 버튼/링크에 명확한 레이블

---

## 3. Reliability Requirements

### 오프라인 지원
- **지원 안 함**
- 네트워크 끊김 시 에러 메시지 표시
- 장바구니는 localStorage에 백업 (재연결 시 복구)

### 에러 처리
- **페이지별 에러 바운더리** 적용
- 에러 발생 시 해당 페이지만 에러 UI 표시
- 다른 페이지는 정상 동작 유지

```tsx
// 각 페이지 레이아웃
<ErrorBoundary fallback={<PageErrorFallback />}>
  <PageContent />
</ErrorBoundary>
```

### API 에러 처리
| 에러 유형 | 처리 방법 |
|----------|----------|
| 네트워크 오류 | "네트워크 연결을 확인해주세요" 메시지 |
| 401 Unauthorized | 로그인 페이지로 리다이렉트 |
| 400 Bad Request | 에러 메시지 표시 (서버 응답) |
| 500 Server Error | "잠시 후 다시 시도해주세요" 메시지 |

---

## 4. Security Requirements

### 인증 토큰 관리
- JWT 토큰 localStorage 저장
- 토큰 만료 시 자동 재로그인 시도 (저장된 PIN 사용)
- XSS 방지: 사용자 입력 이스케이프

### 데이터 보호
- HTTPS 통신 (프로덕션)
- 민감 정보 로깅 금지

---

## 5. Summary

| 카테고리 | 요구사항 |
|----------|----------|
| 로딩 성능 | 3초 이내 |
| 이미지 | 일반 img 태그 |
| 반응형 | 태블릿 전용 (768-1024px) |
| 오프라인 | 미지원 |
| 접근성 | 기본 (시맨틱 HTML, alt) |
| 에러 처리 | 페이지별 에러 바운더리 |
