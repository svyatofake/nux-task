import { test, expect } from '@playwright/test';

const USERNAME = process.env.WIKI_USERNAME ?? '';
const PASSWORD = process.env.WIKI_PASSWORD ?? '';

test.describe('Wikipedia interface language change', () => {
  test.beforeEach(async () => {
    if (!USERNAME || !PASSWORD) {
      throw new Error('Set WIKI_USERNAME and WIKI_PASSWORD in .env');
    }
  });

  test('authorized user can switch interface language to Ukrainian', async ({ page }) => {
    await page.goto('/wiki/Special:UserLogin');
    await page.waitForLoadState('networkidle');

    await page.locator('#wpName1').fill(USERNAME);
    await page.locator('#wpPassword1').fill(PASSWORD);
    await page.locator('#wpLoginAttempt').click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#pt-userpage, #pt-userpage-2, .mw-userlink').first())
      .toBeVisible({ timeout: 15000 });

    await page.goto('/wiki/Special:Preferences');
    await page.waitForLoadState('networkidle');

    await page.locator('#preftab-personal, [href="#mw-prefsection-personal"]').first().click();

    const languageDropdown = page.locator('#wpUserLanguage');
    await languageDropdown.scrollIntoViewIfNeeded();
    await expect(languageDropdown).toBeVisible({ timeout: 10000 });

    await page.selectOption('#wpUserLanguage', 'uk');
    expect(await languageDropdown.inputValue()).toBe('uk');

    await page.locator('#prefcontrol, button[name="wpSave"], input[name="wpSave"]').first().click();
    await page.waitForLoadState('networkidle');

    const successBanner = page.locator('.successbox, #mw-preferences-success, [class*="success"]');
    const pageTitle = page.locator('#firstHeading, h1.firstHeading');

    const isSuccess = await successBanner.first().isVisible().catch(() => false);
    const titleText = await pageTitle.first().textContent().catch(() => '');

    if (!isSuccess && !titleText?.includes('Налаштування')) {
      const currentLang = await page.locator('#wpUserLanguage').inputValue().catch(() => '');
      expect(currentLang).toBe('uk');
    }

    await page.goto('/wiki/Special:Preferences');
    await page.waitForLoadState('networkidle');

    expect(await page.locator('#wpUserLanguage').inputValue()).toBe('uk');
    const finalTitle = await page.locator('#firstHeading, h1.firstHeading').textContent();
    expect(finalTitle).toContain('Налаштування');
  });
});
