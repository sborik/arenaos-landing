import { expect, test } from '@playwright/test'

test.describe('Arena scenes', () => {
  test('loads cinematic preset and toggles presets', async ({ page }) => {
    await page.goto('/arena?scene=cinematic_slowmo')
    await expect(page.getByRole('link', { name: /Cinematic Slow-Mo/ })).toBeVisible({ timeout: 10000 })

    // Active preset button has cyan background
    const active = page.getByRole('link', { name: /Cinematic Slow-Mo/ })
    await expect(active).toHaveAttribute('class', /bg-cyan-600/)

    // Switch preset
    await page.getByRole('link', { name: /LoL Trio/ }).click()
    await expect(page).toHaveURL(/scene=trio_spells/)
  })

  test('animation inspector lists clips', async ({ page }) => {
    await page.goto('/arena/inspect?model=/models/jhin/shan_hai_scrolls_jhin.glb')
    await expect(page.getByText('Animations')).toBeVisible()
    await expect(page.getByText('Spell4', { exact: true })).toBeVisible()
  })
})
