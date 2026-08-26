// @ts-check
import { test, expect } from '@playwright/test';



test.beforeEach(async ({ page }) => {
  await page.goto('https://www.linkedin.com/login/?trk=guest_homepage-basic_nav-header-signin');
  await page.getByRole('textbox', { name: 'Email or phone' }).first().fill('sathis2461@.com');
  await page.locator('input[type="password"]:visible').fill('sathish0102');
  await page.getByRole('button', {
            name: 'Sign in',
            exact: true
    }).click();
});

test('invalid credentials', async ({ page }) => {

     const errors = page.locator('p', {
    hasText: 'Please enter a valid email address.'
});

console.log("Count:", await errors.count());

for (let i = 0; i < await errors.count(); i++) {
    console.log(`----- Element ${i} -----`);

    console.log("Visible:", await errors.nth(i).isVisible());

    console.log(
        "HTML:",
        await errors.nth(i).evaluate(el => el.outerHTML)
    );
}

});

