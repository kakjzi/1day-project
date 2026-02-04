# Build Instructions

## Prerequisites
- Node.js 18+
- npm 9+

## Build Steps

### 1. Install Dependencies
```bash
cd customer-frontend
npm install
```

### 2. Configure Environment
```bash
# .env.local 파일 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 3. Build
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `✓ Generating static pages` 메시지
- **Build Artifacts**: `.next/` 디렉토리
- **Routes**: `/`, `/login`, `/cart`, `/orders`

## Run Development Server
```bash
npm run dev
# http://localhost:3000 에서 확인
```

## Troubleshooting

### Build Fails with Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run build 2>&1 | grep "Type error"
# 에러 메시지 확인 후 해당 파일 수정
```
