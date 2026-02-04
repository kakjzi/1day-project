import { test, expect } from '@playwright/test';

test.describe('고객 주문 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 메인 페이지로 이동
    await page.goto('http://localhost:3000/');
  });

  test('US-001: 고객이 메뉴 목록을 볼 수 있다', async ({ page }) => {
    // Given: 고객이 메인 페이지에 접속
    await page.waitForLoadState('networkidle');
    
    // Then: 메뉴 목록이 표시된다
    await expect(page.locator('text=김치찌개')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=된장찌개')).toBeVisible();
    
    // And: 카테고리 탭이 표시된다
    await expect(page.locator('text=메인 메뉴')).toBeVisible();
  });

  test('US-002: 고객이 메뉴를 선택하고 상세 정보를 볼 수 있다', async ({ page }) => {
    // Given: 메뉴 목록이 표시됨
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=김치찌개')).toBeVisible({ timeout: 10000 });
    
    // When: 메뉴를 클릭
    await page.click('text=김치찌개');
    
    // Then: 메뉴 상세 모달이 열린다
    await expect(page.locator('text=9,000원')).toBeVisible();
  });

  test('US-003: 고객이 메뉴를 장바구니에 담을 수 있다', async ({ page }) => {
    // Given: 메뉴 상세 모달이 열림
    await page.waitForLoadState('networkidle');
    await page.click('text=김치찌개');
    
    // When: 장바구니 담기 버튼 클릭
    await page.click('button:has-text("장바구니")');
    
    // Then: 하단에 장바구니 바가 표시된다
    await expect(page.locator('text=1개')).toBeVisible();
  });

  test('US-004: 고객이 장바구니에서 주문할 수 있다', async ({ page }) => {
    // Given: 장바구니에 메뉴가 담김
    await page.waitForLoadState('networkidle');
    await page.click('text=김치찌개');
    await page.click('button:has-text("장바구니")');
    
    // When: 장바구니 페이지로 이동
    await page.goto('http://localhost:3000/cart');
    await page.waitForLoadState('networkidle');
    
    // And: 주문하기 버튼 클릭
    await page.click('button:has-text("주문하기")');
    
    // Then: 주문 완료 모달이 표시된다
    await expect(page.locator('text=주문이 완료되었습니다')).toBeVisible({ timeout: 10000 });
  });

  test('US-005: 고객이 주문 내역을 확인할 수 있다', async ({ page }) => {
    // Given: 주문이 완료됨
    await page.waitForLoadState('networkidle');
    await page.click('text=김치찌개');
    await page.click('button:has-text("장바구니")');
    await page.goto('http://localhost:3000/cart');
    await page.click('button:has-text("주문하기")');
    await page.waitForTimeout(2000);
    
    // When: 주문내역 페이지로 이동
    await page.goto('http://localhost:3000/orders');
    await page.waitForLoadState('networkidle');
    
    // Then: 주문 내역이 표시된다
    await expect(page.locator('text=주문')).toBeVisible();
  });
});

test.describe('관리자 주문 관리', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자 페이지로 이동
    await page.goto('http://localhost:3001/');
  });

  test('US-006: 관리자가 실시간으로 주문을 확인할 수 있다', async ({ page }) => {
    // Given: 관리자가 대시보드에 접속
    await page.waitForLoadState('networkidle');
    
    // Then: 테이블 목록이 표시된다
    await expect(page.locator('text=테이블 1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=테이블 2')).toBeVisible();
  });

  test('US-007: 관리자가 메뉴를 관리할 수 있다', async ({ page }) => {
    // Given: 관리자가 메뉴 관리 페이지로 이동
    await page.goto('http://localhost:3001/menus');
    await page.waitForLoadState('networkidle');
    
    // Then: 메뉴 목록이 표시된다
    await expect(page.locator('text=김치찌개')).toBeVisible({ timeout: 10000 });
    
    // And: 메뉴 추가 버튼이 있다
    await expect(page.locator('button:has-text("메뉴 추가")')).toBeVisible();
  });
});
