# Customer Frontend - UI/UX Design

## 1. 옵션 선택 UI (트렌디한 디자인)

### 단일 선택 옵션 (예: 맵기 선택)
**Chip 버튼 그룹** - 선택 시 색상 변경 + 체크 아이콘

```
┌─────────────────────────────────────────────────┐
│  맵기 선택 *필수                                 │
│                                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ 순한맛 │ │ 보통  │ │✓매운맛│ │아주매움│   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
│   (회색)     (회색)    (Primary)   (회색)       │
└─────────────────────────────────────────────────┘
```

### 다중 선택 옵션 (예: 토핑 추가)
**토글 카드** - 선택 시 테두리 + 체크 표시

```
┌─────────────────────────────────────────────────┐
│  토핑 추가 (선택)                                │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ ✓ 치즈       │  │   계란       │            │
│  │   +1,000원   │  │   +500원     │            │
│  │  ──────────  │  └──────────────┘            │
│  │  (선택됨)    │                              │
│  └──────────────┘                              │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   라면사리   │  │ ✓ 떡추가     │            │
│  │   +1,000원   │  │   +800원     │            │
│  └──────────────┘  │  ──────────  │            │
│                    │  (선택됨)    │            │
│                    └──────────────┘            │
└─────────────────────────────────────────────────┘
```

### MUI 구현 예시
```tsx
// 단일 선택 - ToggleButtonGroup
<ToggleButtonGroup
  value={selected}
  exclusive
  onChange={handleChange}
  sx={{ flexWrap: 'wrap', gap: 1 }}
>
  {options.map(opt => (
    <ToggleButton 
      key={opt.id} 
      value={opt.id}
      sx={{
        borderRadius: '20px',
        px: 2,
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'white',
        }
      }}
    >
      {selected === opt.id && <CheckIcon sx={{ mr: 0.5 }} />}
      {opt.name}
      {opt.price > 0 && ` +${opt.price.toLocaleString()}원`}
    </ToggleButton>
  ))}
</ToggleButtonGroup>

// 다중 선택 - Card with Checkbox
<Grid container spacing={1}>
  {options.map(opt => (
    <Grid item xs={6} key={opt.id}>
      <Card 
        onClick={() => toggleOption(opt.id)}
        sx={{
          cursor: 'pointer',
          border: selected.includes(opt.id) ? 2 : 1,
          borderColor: selected.includes(opt.id) ? 'primary.main' : 'grey.300',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography>{opt.name}</Typography>
            {selected.includes(opt.id) && <CheckCircleIcon color="primary" />}
          </Box>
          <Typography variant="body2" color="text.secondary">
            +{opt.price.toLocaleString()}원
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

---

## 2. 메뉴 카드 디자인

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │      이미지       │  │  ← 1:1 비율, 라운드 코너
│  │                   │  │
│  │    [품절 배지]    │  │  ← 품절 시 오버레이
│  └───────────────────┘  │
│                         │
│  떡볶이                 │  ← 메뉴명 (굵게)
│  매콤달콤한 떡볶이...   │  ← 설명 (1줄, 말줄임)
│                         │
│  8,000원               │  ← 가격 (Primary 색상)
└─────────────────────────┘
```

---

## 3. 하단 장바구니 바

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🛒 3개  │  총 15,000원  │  ████████████████  주문하기 ████│
│                          │         (Primary 버튼)          │
└─────────────────────────────────────────────────────────────┘
```

- 장바구니 비어있으면 숨김 또는 비활성화
- 클릭 시 `/cart` 페이지로 이동
- "주문하기" 버튼은 장바구니 페이지에서만 활성화

---

## 4. 수량 조절 컨트롤

```
┌─────────────────────────────────────┐
│                                     │
│   ┌───┐  ┌─────┐  ┌───┐            │
│   │ - │  │  2  │  │ + │            │
│   └───┘  └─────┘  └───┘            │
│                                     │
│   (IconButton)  (숫자)  (IconButton)│
└─────────────────────────────────────┘
```

- 최소 수량: 1 (1일 때 - 버튼 비활성화)
- 최대 수량: 99
- 0이 되면 아이템 삭제 확인

---

## 5. 주문 상태 배지

| 상태 | 색상 | 텍스트 |
|------|------|--------|
| PENDING | `warning` (주황) | 대기중 |
| ACCEPTED | `info` (파랑) | 접수됨 |
| PREPARING | `primary` (메인) | 준비중 |
| COMPLETED | `success` (초록) | 완료 |

```tsx
<Chip 
  label={statusText} 
  color={statusColor} 
  size="small"
  sx={{ fontWeight: 'bold' }}
/>
```

---

## 6. 주문 성공 모달

```
┌─────────────────────────────────────┐
│                                     │
│            ✓ (큰 체크 아이콘)       │
│                                     │
│         주문이 완료되었습니다        │
│                                     │
│           주문번호: 3-1             │
│                                     │
│         5초 후 자동으로 닫힙니다     │
│              (4...)                 │
│                                     │
│         [ 확인 ]                    │
│                                     │
└─────────────────────────────────────┘
```

- 5초 카운트다운 표시
- 확인 버튼 클릭 또는 5초 후 자동 닫힘
- 닫히면 메뉴 화면으로 이동 (장바구니 비움)

---

## 7. 색상 테마 (MUI)

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',  // 주황 (식욕 자극)
    },
    secondary: {
      main: '#2D3436',  // 다크 그레이
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
```
