import { test, expect } from '@playwright/test';

test.describe('고객 주문 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // Set mock token in localStorage
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-token-table-1');
    });
    // 각 테스트 전에 메인 페이지로 이동
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('US-001: 고객이 메뉴 목록을 볼 수 있다', async ({ page }) => {
    // Given: 고객이 메인 페이지에 접속
    
    // Then: 메뉴 목록이 표시된다 (더 관대한 선택자 사용)
    const menuItems = page.locator('[class*="MuiCard"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 15000 });
    
    // And: 카테고리 탭이 표시된다
    const tabs = page.locator('[role="tablist"]');
    await expect(tabs).toBeVisible({ timeout: 10000 });
  });

  test('US-002: 고객이 메뉴를 선택하고 상세 정보를 볼 수 있다', async ({ page }) => {
    // Given: 메뉴 목록이 표시됨
    const menuCard = page.locator('[class*="MuiCard"]').first();
    await expect(menuCard).toBeVisible({ timeout: 15000 });
    
    // When: 첫 번째 메뉴를 클릭
    await menuCard.click();
    
    // Then: 메뉴 상세 모달이 열린다
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
  });

  test('US-003: 고객이 메뉴를 장바구니에 담을 수 있다', async ({ page }) => {
    // Given: 메뉴 상세 모달이 열림
    const menuCard = page.locator('[class*="MuiCard"]').first();
    await expect(menuCard).toBeVisible({ timeout: 15000 });
    await menuCard.click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    // When: 필수 옵션 선택 (맵기 선택)
    const firstOption = page.locator('[class*="MuiToggleButton"]').first();
    await firstOption.click();
    await page.waitForTimeout(500);
    
    // When: 장바구니 담기 버튼 클릭
    const addButton = page.locator('button').filter({ hasText: /담기/ }).last();
    await addButton.click();
    
    // Then: 하단에 장바구니 바가 표시된다
    await page.waitForTimeout(1000);
    const cartBar = page.locator('[class*="MuiBox"]').filter({ hasText: /개|원/ });
    await expect(cartBar.first()).toBeVisible({ timeout: 5000 });
  });

  test('US-004: 고객이 장바구니에서 주문할 수 있다', async ({ page }) => {
    // Given: 장바구니에 메뉴가 담김
    const menuCard = page.locator('[class*="MuiCard"]').first();
    await expect(menuCard).toBeVisible({ timeout: 15000 });
    await menuCard.click();
    
    await page.waitForTimeout(1000);
    
    // Select required option
    const firstOption = page.locator('[class*="MuiToggleButton"]').first();
    await firstOption.click();
    await page.waitForTimeout(500);
    
    const addButton = page.locator('button').filter({ hasText: /담기/ }).last();
    await addButton.click();
    await page.waitForTimeout(1000);
    
    // When: 장바구니 페이지로 이동
    await page.goto('http://localhost:3000/cart');
    await page.waitForLoadState('networkidle');
    
    // And: 주문하기 버튼 클릭
    const orderButton = page.locator('button').filter({ hasText: /주문/ });
    await expect(orderButton.first()).toBeVisible({ timeout: 10000 });
    await orderButton.first().click();
    
    // Then: 주문이 처리되고 페이지가 리다이렉트되거나 모달이 표시됨
    await page.waitForTimeout(3000);
    // Check if either redirected to home or modal appeared
    const currentUrl = page.url();
    const hasModal = await page.locator('[role="dialog"]').count() > 0;
    expect(currentUrl === 'http://localhost:3000/' || hasModal).toBeTruthy();
  });

  test('US-005: 고객이 주문 내역을 확인할 수 있다', async ({ page }) => {
    // When: 주문내역 페이지로 이동
    await page.goto('http://localhost:3000/orders');
    await page.waitForLoadState('networkidle');
    
    // Then: 주문내역 페이지가 로드된다
    const pageTitle = page.locator('text=/주문|내역/');
    await expect(pageTitle.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('관리자 주문 관리', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자 페이지로 이동
    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('networkidle');
  });

  test('US-006: 관리자가 실시간으로 주문을 확인할 수 있다', async ({ page }) => {
    // Given: 관리자가 대시보드에 접속
    
    // Then: 테이블 카드가 표시된다
    const tableCards = page.locator('[class*="MuiCard"]');
    await expect(tableCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('US-007: 관리자가 메뉴를 관리할 수 있다', async ({ page }) => {
    // Given: 관리자가 메뉴 관리 페이지로 이동
    await page.goto('http://localhost:3001/menus');
    await page.waitForLoadState('networkidle');
    
    // Then: 메뉴 목록이 표시된다
    const menuCards = page.locator('[class*="MuiCard"]');
    await expect(menuCards.first()).toBeVisible({ timeout: 15000 });
    
    // And: 메뉴 추가 버튼이 있다
    const addButton = page.locator('button').filter({ hasText: /메뉴 추가|추가/ });
    await expect(addButton.first()).toBeVisible({ timeout: 10000 });
  });
});
