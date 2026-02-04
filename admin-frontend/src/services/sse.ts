import { Order, Table, SSEEventType } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type SSECallback = (data: Order | Table) => void;

class SSEService {
  private eventSource: EventSource | null = null;
  private callbacks: Map<SSEEventType, SSECallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private storeId: number | null = null;

  connect(storeId: number): void {
    this.storeId = storeId;
    this.reconnectAttempts = 0;
    this.establishConnection();
  }

  private establishConnection(): void {
    if (!this.storeId) return;

    const token = localStorage.getItem('admin_token') || 'mock-token';
    const url = `${API_URL}/api/admin/orders/stream?store_id=${this.storeId}&token=${token}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE 연결됨');
      this.reconnectAttempts = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const { type, data } = parsed;
        this.notifyCallbacks(type as SSEEventType, data);
      } catch (error) {
        console.error('SSE 메시지 파싱 오류:', error);
      }
    };

    this.eventSource.onerror = () => {
      console.error('SSE 연결 오류');
      this.eventSource?.close();
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('SSE 재연결 실패: 최대 시도 횟수 초과');
      this.notifyCallbacks('ORDER_UPDATE', { error: 'connection_failed' } as unknown as Order);
      return;
    }

    this.reconnectAttempts++;
    console.log(`SSE 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    setTimeout(() => {
      this.establishConnection();
    }, this.reconnectDelay);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.callbacks.clear();
    this.storeId = null;
  }

  onNewOrder(callback: (order: Order) => void): void {
    this.addCallback('NEW_ORDER', callback as SSECallback);
  }

  onOrderUpdate(callback: (order: Order) => void): void {
    this.addCallback('ORDER_UPDATE', callback as SSECallback);
  }

  onOrderDelete(callback: (order: Order) => void): void {
    this.addCallback('ORDER_DELETE', callback as SSECallback);
  }

  onTableUpdate(callback: (table: Table) => void): void {
    this.addCallback('TABLE_UPDATE', callback as SSECallback);
  }

  private addCallback(type: SSEEventType, callback: SSECallback): void {
    const existing = this.callbacks.get(type) || [];
    this.callbacks.set(type, [...existing, callback]);
  }

  private notifyCallbacks(type: SSEEventType, data: Order | Table): void {
    const callbacks = this.callbacks.get(type) || [];
    callbacks.forEach((callback) => callback(data));
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

// 싱글톤 인스턴스
export const sseService = new SSEService();
