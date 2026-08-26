const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { test } = require('../fixtures/testFixtures');
const { expect } = require('@playwright/test');

const csvPath = path.join(
    __dirname,
    '../test-data/loginData.csv'
);

const loginData = parse(
    fs.readFileSync(csvPath),
    {
        columns: true,
        skip_empty_lines: true
    }
);

test.describe('LinkedIn Login Tests', () => {

    for (const data of loginData) {

        test(data.testCase, async ({ page, loginPage }) => {

            await page.goto('https://www.linkedin.com/login');

            await loginPage.login(
                data.email,
                data.password
            );

            switch (data.expectedResult) {


                case 'validCredentials':

                    await expect(page).toHaveURL(/linkedin\.com\/feed/);
                    break;

                case 'invalidCredentials':

                    const invalidError = loginPage.invalidCredentialsError;
                    const securityChallenge = page.getByText("Let's do a quick security check");

                    await Promise.race([
                        invalidError.waitFor({ state: 'visible', timeout: 5000 }),
                        securityChallenge.waitFor({ state: 'visible', timeout: 5000 })
                    ]);

                    if (await invalidError.isVisible()) {
                        console.log("Invalid credentials message displayed");
                    } 
                    else if (await securityChallenge.isVisible()) {
                        console.log("LinkedIn security challenge displayed");
                    }

                    break;

                case 'emptyPassword':

                    await expect(
                        loginPage.emptypass.nth(1)
                    ).toBeVisible();

                    break;

                case 'emptyEmail':

                    await expect(
                        loginPage.emptyemail.nth(1)
                    ).toBeVisible();

                    break;

                case 'invalidEmailFormat':

                    await expect(
                        loginPage.invalidEmailFormatError.nth(1)
                    ).toBeVisible();

                    break;
            }

        });

    }

});