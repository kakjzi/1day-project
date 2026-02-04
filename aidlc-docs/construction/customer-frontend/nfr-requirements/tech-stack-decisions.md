# Customer Frontend - Tech Stack Decisions

## 1. Core Framework

| 기술 | 선택 | 이유 |
|------|------|------|
| Framework | Next.js 14 (App Router) | React 기반, 파일 기반 라우팅 |
| Language | TypeScript | 타입 안정성, 개발 생산성 |
| UI Library | MUI (Material UI) | 풍부한 컴포넌트, 커스터마이징 용이 |

---

## 2. State Management

| 기술 | 선택 | 이유 |
|------|------|------|
| 전역 상태 | React Context API | 단순, 내장, 추가 의존성 없음 |
| 로컬 저장 | localStorage | 장바구니/인증 정보 유지 |

---

## 3. Styling

| 기술 | 선택 | 이유 |
|------|------|------|
| CSS 방식 | MUI sx prop + Emotion | MUI 기본 스타일링 |
| 테마 | MUI createTheme | 일관된 디자인 시스템 |

---

## 4. API Communication

| 기술 | 선택 | 이유 |
|------|------|------|
| HTTP Client | fetch API | 내장, 단순, 추가 의존성 없음 |
| 상태 관리 | 수동 (useState) | MVP 규모에 적합 |

---

## 5. Image Handling

| 기술 | 선택 | 이유 |
|------|------|------|
| 이미지 태그 | 일반 `<img>` | 단순, 서버에서 크기 제한 |
| 최적화 | 없음 (MVP) | 복잡도 감소 |

---

## 6. Error Handling

| 기술 | 선택 | 이유 |
|------|------|------|
| 에러 바운더리 | 페이지별 적용 | 부분 장애 격리 |
| 에러 UI | MUI Alert/Snackbar | 일관된 에러 표시 |

---

## 7. Dependencies

### package.json (예상)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0"
  }
}
```

---

## 8. Project Structure

```
customer-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── cart/
│   │   ├── orders/
│   │   └── login/
│   ├── components/             # React 컴포넌트
│   │   ├── layout/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── order/
│   │   └── common/
│   ├── contexts/               # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── services/               # API 호출
│   │   └── api.ts
│   ├── types/                  # TypeScript 타입
│   │   └── index.ts
│   └── theme/                  # MUI 테마
│       └── theme.ts
├── public/
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## 9. Browser Support

| 브라우저 | 지원 |
|----------|------|
| Chrome (최신) | ✅ |
| Safari (최신) | ✅ |
| Firefox (최신) | ✅ |
| Edge (최신) | ✅ |
| IE | ❌ |
