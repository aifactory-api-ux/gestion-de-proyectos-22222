# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons.spec.ts >> Botones de ProjectTable >> botón Edit existe y es clickeable
- Location: tests-functional/buttons.spec.ts:91:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /edit/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /edit/i }).first()

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Welcome Back" [level=1] [ref=e5]
  - paragraph [ref=e6]: Login to your account
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: Email
      - textbox [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12]: Password
      - textbox [ref=e13]
    - button "Login" [ref=e14] [cursor=pointer]
  - paragraph [ref=e15]: Don't have an account? Register
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Botones de LoginPage', () => {
  4   |   test('botón submit existe y es clickeable', async ({ page }) => {
  5   |     await page.goto('/login');
  6   |     const submitBtn = page.getByRole('button', { name: /login/i });
  7   |     await expect(submitBtn).toBeVisible();
  8   |     await expect(submitBtn).toBeEnabled();
  9   |   });
  10  | 
  11  |   test('botón submit tiene el tipo correcto', async ({ page }) => {
  12  |     await page.goto('/login');
  13  |     const submitBtn = page.locator('button[type="submit"]');
  14  |     await expect(submitBtn).toBeVisible();
  15  |   });
  16  | 
  17  |   test('botón toggle login/register existe y es clickeable', async ({ page }) => {
  18  |     await page.goto('/login');
  19  |     const toggleBtn = page.getByText('Register');
  20  |     await expect(toggleBtn).toBeVisible();
  21  |   });
  22  | 
  23  |   test('botón toggle cambia a modo registro', async ({ page }) => {
  24  |     await page.goto('/login');
  25  |     await page.getByText('Register').click();
  26  |     await expect(page.getByText('Create Account')).toBeVisible();
  27  |   });
  28  | });
  29  | 
  30  | test.describe('Botones de NotFoundPage', () => {
  31  |   test('botón Go to Dashboard existe y es clickeable', async ({ page }) => {
  32  |     await page.goto('/not-found');
  33  |     const dashboardBtn = page.getByRole('button', { name: /go to dashboard/i });
  34  |     await expect(dashboardBtn).toBeVisible();
  35  |     await expect(dashboardBtn).toBeEnabled();
  36  |   });
  37  | 
  38  |   test('botón Go to Dashboard redirige a dashboard', async ({ page }) => {
  39  |     await page.goto('/not-found');
  40  |     await page.getByRole('button', { name: /go to dashboard/i }).click();
  41  |     await expect(page).toHaveURL(/.*dashboard/);
  42  |   });
  43  | });
  44  | 
  45  | test.describe('Botones de Topbar', () => {
  46  |   test('botón Logout existe y es clickeable', async ({ page }) => {
  47  |     await page.goto('/dashboard');
  48  |     const logoutBtn = page.getByRole('button', { name: /logout/i });
  49  |     await expect(logoutBtn).toBeVisible();
  50  |     await expect(logoutBtn).toBeEnabled();
  51  |   });
  52  | });
  53  | 
  54  | test.describe('Botones de ProjectForm', () => {
  55  |   test('botón Save Project existe y es clickeable', async ({ page }) => {
  56  |     await page.goto('/projects/new');
  57  |     const saveBtn = page.getByRole('button', { name: /save project/i });
  58  |     await expect(saveBtn).toBeVisible();
  59  |   });
  60  | 
  61  |   test('botón Save Project tiene tipo submit', async ({ page }) => {
  62  |     await page.goto('/projects/new');
  63  |     const saveBtn = page.locator('button[type="submit"]');
  64  |     await expect(saveBtn).toBeVisible();
  65  |   });
  66  | });
  67  | 
  68  | test.describe('Botones de ChatFloatingButton', () => {
  69  |   test('chat button existe y es clickeable', async ({ page }) => {
  70  |     await page.goto('/dashboard');
  71  |     const chatBtn = page.locator('button').filter({ hasText: /💬/ });
  72  |     await expect(chatBtn).toBeVisible();
  73  |   });
  74  | });
  75  | 
  76  | test.describe('Botones de NotificationList', () => {
  77  |   test('botón Mark as Read existe y es clickeable', async ({ page }) => {
  78  |     await page.goto('/notifications');
  79  |     const markBtn = page.getByRole('button', { name: /mark as read/i });
  80  |     await expect(markBtn.first()).toBeVisible();
  81  |   });
  82  | 
  83  |   test('botón Delete existe y es clickeable', async ({ page }) => {
  84  |     await page.goto('/notifications');
  85  |     const deleteBtn = page.getByRole('button', { name: /delete/i });
  86  |     await expect(deleteBtn.first()).toBeVisible();
  87  |   });
  88  | });
  89  | 
  90  | test.describe('Botones de ProjectTable', () => {
  91  |   test('botón Edit existe y es clickeable', async ({ page }) => {
  92  |     await page.goto('/projects');
  93  |     const editBtn = page.getByRole('button', { name: /edit/i });
> 94  |     await expect(editBtn.first()).toBeVisible();
      |                                   ^ Error: expect(locator).toBeVisible() failed
  95  |   });
  96  | 
  97  |   test('botón Delete existe y es clickeable', async ({ page }) => {
  98  |     await page.goto('/projects');
  99  |     const deleteBtn = page.getByRole('button', { name: /delete/i });
  100 |     await expect(deleteBtn.first()).toBeVisible();
  101 |   });
  102 | });
  103 | 
  104 | test.describe('Botones de Button Component', () => {
  105 |   test('botón deshabilitado no es clickeable', async ({ page }) => {
  106 |     await page.goto('/login');
  107 |     const submitBtn = page.locator('button[type="submit"]');
  108 |     await expect(submitBtn).toBeDisabled();
  109 |   });
  110 | 
  111 |   test('botón con loading muestra estado de carga', async ({ page }) => {
  112 |     await page.goto('/login');
  113 |     const submitBtn = page.locator('button[type="submit"]');
  114 |     await expect(submitBtn).toContainText(/login/i);
  115 |   });
  116 | });
```