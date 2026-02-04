# 테이블오더 관리자 프론트엔드

테이블오더 서비스의 관리자용 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **UI Library**: MUI (Material UI)
- **Language**: TypeScript
- **State Management**: React Context API
- **Real-time**: Server-Sent Events (SSE)

## 주요 기능

- 관리자 로그인/등록
- 실시간 주문 모니터링 (SSE)
- 주문 상태 관리 (대기중 → 접수 → 준비중 → 완료)
- 테이블 관리 (이용 완료, 주문 이동, 과거 내역)
- 메뉴/카테고리/옵션 관리

## 시작하기

### 환경 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_STORE_ID=1
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3001)
npm run dev -- -p 3001
```

### 빌드

```bash
npm run build
npm start -- -p 3001
```

## 디렉토리 구조

```
src/
├── app/                    # 페이지 (App Router)
│   ├── page.tsx           # 대시보드
│   ├── login/             # 로그인
│   ├── register/          # 관리자 등록
│   ├── menus/             # 메뉴 관리
│   └── tables/            # 테이블 관리
├── components/            # 재사용 컴포넌트
├── contexts/              # React Context
├── services/              # API 및 SSE 서비스
└── types/                 # TypeScript 타입
```

## API 연동

백엔드 API (FastAPI)가 `http://localhost:8000`에서 실행 중이어야 합니다.

### 주요 API 엔드포인트

- `POST /api/admin/login` - 관리자 로그인
- `POST /api/admin/register` - 관리자 등록
- `GET /api/admin/orders/stream` - SSE 주문 스트림
- `PATCH /api/admin/orders/{id}/status` - 주문 상태 변경
- `POST /api/admin/tables/{id}/complete` - 테이블 이용 완료

## 알림음

신규 주문 시 알림음을 재생하려면 `public/notification.mp3` 파일을 추가하세요.

## 라이선스

MIT
