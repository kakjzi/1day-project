# Domain Entities - Backend

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    Store    │───────│    Admin    │
└──────┬──────┘       └─────────────┘
       │ 1:N
       │
┌──────▼──────┐       ┌─────────────┐
│    Table    │───────│    Cart     │  (NEW: 서버 저장)
└──────┬──────┘       └─────────────┘
       │ 1:N
       │
┌──────▼──────┐
│    Order    │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────┐       ┌─────────────┐
│  OrderItem  │───────│OrderItemOpt │
└─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Category   │──1:N──│    Menu     │──1:N──│ OptionGroup │
└─────────────┘       └─────────────┘       └──────┬──────┘
                                                   │ 1:N
                                            ┌──────▼──────┐
                                            │   Option    │
                                            └─────────────┘
```

---

## Entity Definitions

### Store (매장)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 매장 ID |
| name | VARCHAR(100) | 매장명 |
| created_at | DATETIME | 생성일시 |

### Admin (관리자)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 관리자 ID |
| store_id | INT FK | 매장 ID |
| username | VARCHAR(50) | 사용자명 |
| password_hash | VARCHAR(255) | 비밀번호 해시 |
| created_at | DATETIME | 생성일시 |

### Table (테이블)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 테이블 ID |
| store_id | INT FK | 매장 ID |
| table_number | INT | 테이블 번호 |
| pin | VARCHAR(4) | 4자리 PIN |
| session_id | VARCHAR(36) | 현재 세션 UUID |
| session_started_at | DATETIME | 세션 시작 시간 |
| daily_order_count | INT | 당일 주문 순번 카운터 |
| last_order_date | DATE | 마지막 주문 날짜 (순번 리셋용) |

### Category (카테고리)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 카테고리 ID |
| store_id | INT FK | 매장 ID |
| name | VARCHAR(50) | 카테고리명 |
| sort_order | INT | 정렬 순서 |

### Menu (메뉴)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 메뉴 ID |
| category_id | INT FK | 카테고리 ID |
| name | VARCHAR(100) | 메뉴명 |
| description | TEXT | 설명 |
| price | INT | 가격 |
| image_url | VARCHAR(255) | 이미지 URL |
| sort_order | INT | 정렬 순서 |
| is_sold_out | BOOLEAN | 품절 여부 |
| created_at | DATETIME | 생성일시 |

### OptionGroup (옵션 그룹)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 옵션 그룹 ID |
| menu_id | INT FK | 메뉴 ID |
| name | VARCHAR(50) | 그룹명 (예: 맵기 선택) |
| is_required | BOOLEAN | 필수 여부 |
| max_select | INT | 최대 선택 수 (1=단일선택) |

### Option (옵션)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 옵션 ID |
| option_group_id | INT FK | 옵션 그룹 ID |
| name | VARCHAR(50) | 옵션명 |
| price | INT | 추가 가격 |

### Cart (장바구니) - NEW
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 장바구니 ID |
| table_id | INT FK | 테이블 ID |
| menu_id | INT FK | 메뉴 ID |
| quantity | INT | 수량 |
| options | JSON | 선택된 옵션 [{option_id, name, price}] |
| created_at | DATETIME | 생성일시 |

### Order (주문)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 주문 ID (DB) |
| display_number | VARCHAR(10) | 표시 번호 (예: 3-1) |
| store_id | INT FK | 매장 ID |
| table_id | INT FK | 테이블 ID |
| session_id | VARCHAR(36) | 테이블 세션 ID |
| status | ENUM | PENDING/ACCEPTED/PREPARING/COMPLETED |
| total_amount | INT | 총 금액 |
| created_at | DATETIME | 주문 시각 |

### OrderItem (주문 항목)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 주문 항목 ID |
| order_id | INT FK | 주문 ID |
| menu_id | INT FK | 메뉴 ID |
| menu_name | VARCHAR(100) | 메뉴명 (스냅샷) |
| quantity | INT | 수량 |
| unit_price | INT | 단가 |
| subtotal | INT | 소계 (옵션 포함) |

### OrderItemOption (주문 항목 옵션)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | ID |
| order_item_id | INT FK | 주문 항목 ID |
| option_id | INT FK | 옵션 ID |
| option_name | VARCHAR(50) | 옵션명 (스냅샷) |
| price | INT | 추가 가격 (스냅샷) |

### OrderHistory (주문 이력)
| Field | Type | Description |
|-------|------|-------------|
| id | INT PK | 이력 ID |
| original_order_id | INT | 원본 주문 ID |
| store_id | INT FK | 매장 ID |
| table_id | INT FK | 테이블 ID |
| table_number | INT | 테이블 번호 (스냅샷) |
| session_id | VARCHAR(36) | 세션 ID |
| display_number | VARCHAR(10) | 표시 번호 |
| order_data | JSON | 전체 주문 데이터 |
| total_amount | INT | 총 금액 |
| completed_at | DATETIME | 이용 완료 시각 |
