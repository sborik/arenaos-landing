import { expect, test } from '@playwright/test'

test.describe('Preview page', () => {
  test('shows guidance when clip param is missing', async ({ page }) => {
    await page.goto('/preview')
    await expect(page.getByText('No clip specified')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Go to Curator →' })).toBeVisible()
  })

  test('surfaces an error when frames are missing', async ({ page }) => {
    await page.goto('/preview?clip=missing-clip')
    await expect(
      page.getByText('No frames found. Make sure the clip has been processed.')
    ).toBeVisible()
  })

  test('renders a seeded sample clip without errors', async ({ page }) => {
    await page.goto('/preview?clip=sample-clip')

    await expect(page.getByRole('heading', { name: 'Preview: sample-clip' })).toBeVisible()
    await expect(page.getByText(/frames • Move mouse for parallax/)).toBeVisible()
    await page.waitForSelector('canvas', { timeout: 15000 })
    await expect(page.locator('canvas')).toHaveCount(1)
    await expect(page.getByText('No frames found')).toHaveCount(0)
  })

  test('allows adjusting preview controls', async ({ page }) => {
    await page.goto('/preview?clip=sample-clip')

    const parallaxSlider = page.getByLabel('Parallax Strength:')
    const fpsSlider = page.getByLabel('FPS:')

    await parallaxSlider.fill('0.9')
    await fpsSlider.fill('5')

    await expect(parallaxSlider).toHaveValue('0.9')
    await expect(fpsSlider).toHaveValue('5')
  })
})
