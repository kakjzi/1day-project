# Business Logic Model - Backend

## 1. 주문 생성 로직

### Flow
```
1. 요청 검증
   ├── 테이블 인증 확인
   ├── 장바구니 데이터 검증
   └── 품절 메뉴 확인

2. 세션 확인/생성
   ├── 테이블에 session_id 있음 → 기존 세션 사용
   └── 테이블에 session_id 없음 → 새 세션 생성

3. 주문 번호 생성
   ├── 날짜 변경 확인 → 순번 리셋
   └── display_number = "{table_number}-{daily_count}"

4. 주문 생성
   ├── Order 레코드 생성
   ├── OrderItem 레코드 생성 (메뉴별)
   └── OrderItemOption 레코드 생성 (옵션별)

5. 후처리
   ├── 장바구니 삭제
   └── SSE 이벤트 발행
```

### Pseudocode
```python
def create_order(table_id, cart_items):
    # 1. 검증
    table = get_table(table_id)
    validate_cart_items(cart_items)  # 품절 체크
    
    # 2. 세션 확인
    if not table.session_id:
        table.session_id = uuid4()
        table.session_started_at = now()
    
    # 3. 주문 번호
    display_number = generate_display_number(table)
    
    # 4. 주문 생성
    order = Order(
        display_number=display_number,
        store_id=table.store_id,
        table_id=table.id,
        session_id=table.session_id,
        status=OrderStatus.PENDING,
        total_amount=calculate_total(cart_items)
    )
    
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            menu_id=item.menu_id,
            menu_name=item.menu.name,  # 스냅샷
            quantity=item.quantity,
            unit_price=item.menu.price,
            subtotal=calculate_item_total(item)
        )
        for option in item.options:
            OrderItemOption(
                order_item_id=order_item.id,
                option_id=option.id,
                option_name=option.name,  # 스냅샷
                price=option.price  # 스냅샷
            )
    
    # 5. 후처리
    clear_cart(table_id)
    broadcast_event('new_order', order)
    
    return order
```

---

## 2. 주문 상태 전이 로직

### State Machine
```
┌─────────┐    accept    ┌──────────┐   prepare   ┌───────────┐   complete   ┌───────────┐
│ PENDING │─────────────>│ ACCEPTED │────────────>│ PREPARING │─────────────>│ COMPLETED │
└─────────┘              └──────────┘             └───────────┘              └───────────┘
     │                        │                        │
     └────────────────────────┴────────────────────────┘
                         (삭제 가능)
```

### Allowed Transitions
| From | To | Action |
|------|-----|--------|
| PENDING | ACCEPTED | accept |
| ACCEPTED | PREPARING | prepare |
| PREPARING | COMPLETED | complete |

### Pseudocode
```python
VALID_TRANSITIONS = {
    OrderStatus.PENDING: [OrderStatus.ACCEPTED],
    OrderStatus.ACCEPTED: [OrderStatus.PREPARING],
    OrderStatus.PREPARING: [OrderStatus.COMPLETED],
    OrderStatus.COMPLETED: []
}

def update_order_status(order_id, new_status):
    order = get_order(order_id)
    
    if new_status not in VALID_TRANSITIONS[order.status]:
        raise InvalidStatusTransition(
            f"Cannot transition from {order.status} to {new_status}"
        )
    
    order.status = new_status
    broadcast_event('order_update', order)
    
    return order
```

---

## 3. 테이블 이용 완료 로직

### Flow
```
1. 현재 세션 주문 조회
2. OrderHistory로 복사
3. 원본 주문 삭제 (또는 archived 플래그)
4. 장바구니 삭제
5. 테이블 세션 리셋
6. SSE 이벤트 발행
```

### Pseudocode
```python
def complete_table_session(table_id):
    table = get_table(table_id)
    
    if not table.session_id:
        raise NoActiveSession()
    
    # 1. 현재 세션 주문 조회
    orders = get_orders_by_session(table.session_id)
    
    # 2. OrderHistory로 복사
    for order in orders:
        OrderHistory(
            original_order_id=order.id,
            store_id=order.store_id,
            table_id=order.table_id,
            table_number=table.table_number,
            session_id=order.session_id,
            display_number=order.display_number,
            order_data=serialize_order(order),  # JSON
            total_amount=order.total_amount,
            completed_at=now()
        )
    
    # 3. 원본 주문 삭제
    delete_orders_by_session(table.session_id)
    
    # 4. 장바구니 삭제
    clear_cart(table_id)
    
    # 5. 테이블 리셋
    table.session_id = None
    table.session_started_at = None
    # daily_order_count는 유지 (당일 순번 계속)
    
    # 6. SSE 이벤트
    broadcast_event('table_complete', {'table_id': table_id})
```

---

## 4. 테이블 주문 이동 로직

### Flow
```
1. 원본/대상 테이블 검증
2. 대상 테이블 세션 확인/생성
3. 주문 이동 (table_id, session_id 변경)
4. 장바구니 이동
5. 원본 테이블 세션 리셋
6. SSE 이벤트 발행
```

### Pseudocode
```python
def transfer_orders(source_table_id, target_table_id):
    source = get_table(source_table_id)
    target = get_table(target_table_id)
    
    if not source.session_id:
        raise NoActiveSession("Source table has no active session")
    
    # 대상 테이블 세션 확인
    if not target.session_id:
        target.session_id = uuid4()
        target.session_started_at = now()
    
    # 주문 이동
    orders = get_orders_by_session(source.session_id)
    for order in orders:
        order.table_id = target.id
        order.session_id = target.session_id
        # display_number는 유지 (원래 테이블 번호 기록)
    
    # 장바구니 이동
    transfer_cart(source_table_id, target_table_id)
    
    # 원본 테이블 리셋
    source.session_id = None
    source.session_started_at = None
    
    # SSE 이벤트
    broadcast_event('order_transfer', {
        'source_table_id': source_table_id,
        'target_table_id': target_table_id,
        'order_count': len(orders)
    })
```

---

## 5. SSE 이벤트 브로드캐스트 로직

### Event Types
| Event | Payload | Trigger |
|-------|---------|---------|
| new_order | Order 전체 | 주문 생성 |
| order_update | Order 전체 | 상태 변경 |
| order_delete | {order_id} | 주문 삭제 |
| order_transfer | {source, target, count} | 주문 이동 |
| table_complete | {table_id} | 이용 완료 |
| heartbeat | {timestamp} | 15초마다 |

### Pseudocode
```python
# 전역 구독자 관리
subscribers: Dict[int, List[Queue]] = {}  # store_id -> queues

async def subscribe(store_id):
    queue = Queue()
    if store_id not in subscribers:
        subscribers[store_id] = []
    subscribers[store_id].append(queue)
    
    try:
        while True:
            try:
                event = await wait_for(queue.get(), timeout=15)
                yield f"data: {json.dumps(event)}\n\n"
            except TimeoutError:
                yield f": heartbeat {datetime.now().isoformat()}\n\n"
    finally:
        subscribers[store_id].remove(queue)

def broadcast_event(event_type, data, store_id):
    event = {'type': event_type, 'data': data, 'timestamp': now()}
    for queue in subscribers.get(store_id, []):
        queue.put_nowait(event)
```
