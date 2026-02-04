# E2E 테스트 가이드

## 🧪 Playwright E2E 테스트

### 설치 완료
- ✅ @playwright/test 설치됨
- ✅ Chromium 브라우저 설치됨
- ✅ 테스트 파일 생성됨

### 테스트 실행 방법

#### 1. Docker 컨테이너 실행 (필수)
```bash
# 프로젝트 루트에서
docker-compose up -d
```

#### 2. 테스트 실행
```bash
cd customer-frontend

# 기본 실행 (헤드리스 모드)
npm run test:e2e

# UI 모드 (추천 - 시각적으로 확인)
npm run test:e2e:ui

# 브라우저 보면서 실행
npm run test:e2e:headed

# 특정 테스트만 실행
npx playwright test user-stories.spec.ts

# 리포트 보기
npm run test:e2e:report
```

### 테스트 시나리오

#### 고객 주문 플로우
- ✅ US-001: 메뉴 목록 조회
- ✅ US-002: 메뉴 상세 정보 확인
- ✅ US-003: 장바구니 담기
- ✅ US-004: 주문하기
- ✅ US-005: 주문 내역 확인

#### 관리자 기능
- ✅ US-006: 실시간 주문 확인
- ✅ US-007: 메뉴 관리

### 테스트 결과 확인

테스트 실행 후:
- `playwright-report/` 디렉토리에 HTML 리포트 생성
- 실패한 테스트의 스크린샷 자동 저장
- 트레이스 파일로 디버깅 가능

### 디버깅

```bash
# 디버그 모드로 실행
npx playwright test --debug

# 특정 테스트만 디버그
npx playwright test user-stories.spec.ts --debug
```

### CI/CD 통합

GitHub Actions에서 자동 실행하려면:
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: docker-compose up -d
      - run: npm run test:e2e
```

### 주의사항

1. **Docker 컨테이너가 실행 중이어야 함**
   - backend: http://localhost:8000
   - customer-frontend: http://localhost:3000
   - admin-frontend: http://localhost:3001

2. **데이터베이스 초기화**
   - 테스트 전 샘플 데이터가 있어야 함
   - `docker-compose exec backend python seed_data.py`

3. **타임아웃**
   - 네트워크가 느리면 타임아웃 증가 필요
   - `playwright.config.ts`에서 조정 가능
