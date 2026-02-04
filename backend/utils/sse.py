"""
Server-Sent Events (SSE) 유틸리티
"""
import asyncio
import json
from typing import Dict, Set, Any
from dataclasses import dataclass, field


def format_sse_event(event_type: str, data: Any) -> str:
    """SSE 이벤트 포맷"""
    json_data = json.dumps(data, ensure_ascii=False)
    return f"event: {event_type}\ndata: {json_data}\n\n"


@dataclass
class EventManager:
    """SSE 이벤트 매니저"""
    # store_id -> set of queues
    _subscribers: Dict[int, Set[asyncio.Queue]] = field(default_factory=dict)
    
    def subscribe(self, store_id: int) -> asyncio.Queue:
        """매장 이벤트 구독"""
        if store_id not in self._subscribers:
            self._subscribers[store_id] = set()
        
        queue = asyncio.Queue()
        self._subscribers[store_id].add(queue)
        return queue
    
    def unsubscribe(self, store_id: int, queue: asyncio.Queue):
        """구독 해제"""
        if store_id in self._subscribers:
            self._subscribers[store_id].discard(queue)
    
    async def broadcast(self, store_id: int, event_type: str, data: Any):
        """매장의 모든 구독자에게 이벤트 전송"""
        if store_id not in self._subscribers:
            return
        
        message = format_sse_event(event_type, data)
        
        for queue in self._subscribers[store_id]:
            await queue.put(message)
    
    def broadcast_sync(self, store_id: int, event_type: str, data: Any):
        """동기 방식 브로드캐스트 (비동기 컨텍스트 외부에서 사용)"""
        if store_id not in self._subscribers:
            return
        
        message = format_sse_event(event_type, data)
        
        for queue in self._subscribers[store_id]:
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                pass  # 큐가 가득 차면 무시


# 싱글톤 인스턴스
event_manager = EventManager()
