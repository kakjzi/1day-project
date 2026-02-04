# Customer Frontend - Page & Component Structure

## 1. 페이지 구조

```
src/app/
├── layout.tsx              # 공통 레이아웃 (하단 장바구니 바 포함)
├── page.tsx                # 메뉴 화면 (기본 페이지)
├── cart/
│   └── page.tsx            # 장바구니 상세 페이지
├── orders/
│   └── page.tsx            # 주문 내역 페이지
└── login/
    └── page.tsx            # 테이블 로그인 (초기 설정)
```

## 2. 화면 플로우

```
┌─────────────┐     인증 없음     ┌─────────────┐
│   시작      │─────────────────>│   로그인    │
└─────────────┘                  │   /login    │
                                 └──────┬──────┘
                                        │ 로그인 성공
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      메뉴 화면 (/)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [메인] [사이드] [음료] [디저트]  ← 카테고리 탭      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ 메뉴카드 │ │ 메뉴카드 │ │ 메뉴카드 │  ← 메뉴 그리드     │
│  └─────────┘ └─────────┘ └─────────┘                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🛒 장바구니 3개  |  15,000원  |  [주문하기]         │   │ ← 하단 고정 바
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │                              │
        │ 메뉴 클릭                     │ 장바구니 클릭
        ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│   메뉴 상세     │            │   장바구니      │
│   (모달)        │            │   /cart         │
│                 │            │                 │
│ [장바구니 담기] │            │ [주문하기]      │
└─────────────────┘            └────────┬────────┘
                                        │ 주문 확정
                                        ▼
                               ┌─────────────────┐
                               │   주문 성공     │
                               │   (모달 5초)    │
                               └─────────────────┘
```

## 3. 컴포넌트 구조

```
src/components/
├── layout/
│   ├── Header.tsx              # 상단 헤더 (매장명, 테이블 번호)
│   ├── BottomCartBar.tsx       # 하단 장바구니 고정 바
│   └── CategoryTabs.tsx        # 카테고리 탭 네비게이션
├── menu/
│   ├── MenuGrid.tsx            # 메뉴 카드 그리드
│   ├── MenuCard.tsx            # 개별 메뉴 카드
│   ├── MenuDetailModal.tsx     # 메뉴 상세 모달
│   ├── OptionSelector.tsx      # 옵션 선택 UI
│   └── SoldOutBadge.tsx        # 품절 배지
├── cart/
│   ├── CartItemList.tsx        # 장바구니 아이템 목록
│   ├── CartItem.tsx            # 개별 장바구니 아이템
│   ├── QuantityControl.tsx     # 수량 +/- 컨트롤
│   └── CartSummary.tsx         # 총액 요약
├── order/
│   ├── OrderList.tsx           # 주문 목록
│   ├── OrderCard.tsx           # 개별 주문 카드
│   ├── OrderStatusBadge.tsx    # 주문 상태 배지
│   └── OrderSuccessModal.tsx   # 주문 성공 모달
└── common/
    ├── LoadingSpinner.tsx      # 로딩 스피너
    └── ErrorMessage.tsx        # 에러 메시지
```

## 4. 페이지별 컴포넌트 매핑

### 4.1 메뉴 페이지 (`/`)
```tsx
<Layout>
  <Header />
  <CategoryTabs />
  <MenuGrid>
    <MenuCard /> × N
  </MenuGrid>
  <BottomCartBar />
  <MenuDetailModal />  {/* 조건부 렌더링 */}
</Layout>
```

### 4.2 장바구니 페이지 (`/cart`)
```tsx
<Layout>
  <Header title="장바구니" />
  <CartItemList>
    <CartItem>
      <QuantityControl />
    </CartItem> × N
  </CartItemList>
  <CartSummary />
  <OrderButton />
  <OrderSuccessModal />  {/* 조건부 렌더링 */}
</Layout>
```

### 4.3 주문 내역 페이지 (`/orders`)
```tsx
<Layout>
  <Header title="주문 내역" />
  <OrderList>
    <OrderCard>
      <OrderStatusBadge />
    </OrderCard> × N
  </OrderList>
  <BottomCartBar />
</Layout>
```

### 4.4 로그인 페이지 (`/login`)
```tsx
<LoginForm>
  <StoreIdInput />
  <TableNumberInput />
  <PinInput />
  <LoginButton />
</LoginForm>
```
