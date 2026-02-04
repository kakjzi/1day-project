# Table Order Backend API

테이블오더 서비스 백엔드 API (FastAPI + SQLAlchemy + MySQL)

## 기술 스택

- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: MySQL
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt

## 설치 및 실행

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일 수정
```

### 3. 데이터베이스 생성

```sql
CREATE DATABASE tableorder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 샘플 데이터 생성

```bash
python seed_data.py
```

### 5. 서버 실행

```bash
uvicorn main:app --reload --port 8000
```

## API 문서

서버 실행 후 접속:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 테스트 실행

```bash
# 전체 테스트
pytest tests/ -v

# 커버리지 포함
pytest tests/ -v --cov=. --cov-report=html
```

## API 엔드포인트

### 인증
- `POST /api/tables/login` - 테이블 로그인
- `POST /api/admin/login` - 관리자 로그인
- `POST /api/admin/register` - 관리자 등록
- `GET /api/admin/me` - 현재 관리자 정보

### 메뉴
- `GET /api/menus` - 메뉴 목록
- `GET /api/menus/{id}` - 메뉴 상세
- `GET /api/categories` - 카테고리 목록

### 장바구니
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart` - 장바구니 추가
- `PUT /api/cart/{id}` - 장바구니 수정
- `DELETE /api/cart/{id}` - 장바구니 항목 삭제
- `DELETE /api/cart` - 장바구니 비우기

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 (테이블)

### 관리자 API
- `GET /api/admin/orders` - 전체 주문 조회
- `GET /api/admin/orders/stream` - 실시간 주문 스트림 (SSE)
- `PATCH /api/admin/orders/{id}/status` - 주문 상태 변경
- `DELETE /api/admin/orders/{id}` - 주문 삭제
- `POST /api/admin/menus` - 메뉴 등록
- `PUT /api/admin/menus/{id}` - 메뉴 수정
- `DELETE /api/admin/menus/{id}` - 메뉴 삭제
- `GET /api/admin/tables` - 테이블 목록
- `POST /api/admin/tables` - 테이블 생성
- `POST /api/admin/tables/{id}/complete` - 이용 완료
- `POST /api/admin/tables/{id}/transfer` - 주문 이동
- `GET /api/admin/tables/{id}/history` - 과거 주문 조회

## 샘플 계정

- **관리자**: admin / admin123
- **테이블 1**: PIN 1234
- **테이블 2**: PIN 2234
- **테이블 3**: PIN 3234
- **테이블 4**: PIN 4234
- **테이블 5**: PIN 5234
