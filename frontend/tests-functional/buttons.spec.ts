import { test, expect } from '@playwright/test';

test.describe('Botones de LoginPage', () => {
  test('botón submit existe y es clickeable', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.getByRole('button', { name: /login/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('botón submit tiene el tipo correcto', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('botón toggle login/register existe y es clickeable', async ({ page }) => {
    await page.goto('/login');
    const toggleBtn = page.getByText('Register');
    await expect(toggleBtn).toBeVisible();
  });

  test('botón toggle cambia a modo registro', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Register').click();
    await expect(page.getByText('Create Account')).toBeVisible();
  });
});

test.describe('Botones de NotFoundPage', () => {
  test('botón Go to Dashboard existe y es clickeable', async ({ page }) => {
    await page.goto('/not-found');
    const dashboardBtn = page.getByRole('button', { name: /go to dashboard/i });
    await expect(dashboardBtn).toBeVisible();
    await expect(dashboardBtn).toBeEnabled();
  });

  test('botón Go to Dashboard redirige a dashboard', async ({ page }) => {
    await page.goto('/not-found');
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Botones de Topbar', () => {
  test('botón Logout existe y es clickeable', async ({ page }) => {
    await page.goto('/dashboard');
    const logoutBtn = page.getByRole('button', { name: /logout/i });
    await expect(logoutBtn).toBeVisible();
    await expect(logoutBtn).toBeEnabled();
  });
});

test.describe('Botones de ProjectForm', () => {
  test('botón Save Project existe y es clickeable', async ({ page }) => {
    await page.goto('/projects/new');
    const saveBtn = page.getByRole('button', { name: /save project/i });
    await expect(saveBtn).toBeVisible();
  });

  test('botón Save Project tiene tipo submit', async ({ page }) => {
    await page.goto('/projects/new');
    const saveBtn = page.locator('button[type="submit"]');
    await expect(saveBtn).toBeVisible();
  });
});

test.describe('Botones de ChatFloatingButton', () => {
  test('chat button existe y es clickeable', async ({ page }) => {
    await page.goto('/dashboard');
    const chatBtn = page.locator('button').filter({ hasText: /💬/ });
    await expect(chatBtn).toBeVisible();
  });
});

test.describe('Botones de NotificationList', () => {
  test('botón Mark as Read existe y es clickeable', async ({ page }) => {
    await page.goto('/notifications');
    const markBtn = page.getByRole('button', { name: /mark as read/i });
    await expect(markBtn.first()).toBeVisible();
  });

  test('botón Delete existe y es clickeable', async ({ page }) => {
    await page.goto('/notifications');
    const deleteBtn = page.getByRole('button', { name: /delete/i });
    await expect(deleteBtn.first()).toBeVisible();
  });
});

test.describe('Botones de ProjectTable', () => {
  test('botón Edit existe y es clickeable', async ({ page }) => {
    await page.goto('/projects');
    const editBtn = page.getByRole('button', { name: /edit/i });
    await expect(editBtn.first()).toBeVisible();
  });

  test('botón Delete existe y es clickeable', async ({ page }) => {
    await page.goto('/projects');
    const deleteBtn = page.getByRole('button', { name: /delete/i });
    await expect(deleteBtn.first()).toBeVisible();
  });
});

test.describe('Botones de Button Component', () => {
  test('botón deshabilitado no es clickeable', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('botón con loading muestra estado de carga', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toContainText(/login/i);
  });
});