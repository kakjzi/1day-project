# Unit Test Execution

## 테스트 프레임워크
- Jest + React Testing Library (권장)
- 현재 상태: 테스트 미작성 (사용자 요청 시 추가)

## 테스트 설정 (필요 시)
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

## 테스트 실행
```bash
npm test
```

## 테스트 대상 컴포넌트
| 컴포넌트 | 테스트 항목 |
|---------|-----------|
| AuthContext | 로그인/로그아웃, 토큰 저장 |
| CartContext | 아이템 추가/삭제/수량변경 |
| MenuCard | 품절 표시, 클릭 이벤트 |
| MenuDetailModal | 옵션 선택, 수량 조절 |
| CartItem | 수량 변경, 삭제 |
| OrderCard | 상태별 표시 |

## 참고
- 사용자가 테스트 작성을 요청하지 않아 테스트 코드 미생성
- 필요 시 요청하면 테스트 코드 추가 가능
