import { expect, test } from '@playwright/test'

test.describe('Curator page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.alert = () => {}
      ;(window as any).__copied = ''
      if (!navigator.clipboard) {
        // @ts-ignore - allow stubbed clipboard for tests
        navigator.clipboard = {
          writeText: (text: string) => {
            ;(window as any).__copied = text
            return Promise.resolve()
          },
        }
      } else {
        navigator.clipboard.writeText = (text: string) => {
          ;(window as any).__copied = text
          return Promise.resolve()
        }
      }
    })
  })

  test('loads clips, filters, selects, and processes a clip', async ({ page }) => {
    await page.route('**/api/process-clip', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: 'stubbed-clip' }),
      })
    })

    await page.goto('/curator')

    await expect(page.getByRole('heading', { name: 'Clip Curator' })).toBeVisible()

    const card = page.locator('main .grid > div').first()
    await expect(card).toBeVisible()

    await page.getByRole('combobox').selectOption('League of Legends')
    await expect(card.getByText('League of Legends')).toBeVisible()

    await card.click()
    await expect(page.getByText('Selected:')).toBeVisible()

    const processButton = card.getByRole('button', { name: /Process/ })
    await processButton.click()
    await expect(processButton).toHaveText(/Processed/)
  })

  test('bulk process, export JSON, and copy download commands for multiple clips', async ({ page }) => {
    let processCalls = 0
    await page.route('**/api/process-clip', async (route) => {
      processCalls += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: `stubbed-${processCalls}` }),
      })
    })

    await page.goto('/curator')

    const cards = page.locator('main .grid > div')
    await expect(cards.nth(0)).toBeVisible()
    await expect(cards.nth(1)).toBeVisible()

    await cards.nth(0).click()
    await cards.nth(1).click()

    await page.getByRole('button', { name: /Export JSON/i }).click()
    const exported = await page.evaluate(() => (window as any).__copied)
    expect(exported).toContain('"id"')

    await page.getByRole('button', { name: /Copy Download Commands/i }).click()
    const commands = await page.evaluate(() => (window as any).__copied)
    expect(commands).toMatch(/yt-dlp/)

    await page.getByRole('button', { name: /Process 2 Clips/ }).click()
    await expect.poll(() => processCalls).toBe(2)
    await expect(cards.nth(0).getByRole('button', { name: /Processed/ })).toBeVisible()
    await expect(cards.nth(1).getByRole('button', { name: /Processed/ })).toBeVisible()
  })
})
