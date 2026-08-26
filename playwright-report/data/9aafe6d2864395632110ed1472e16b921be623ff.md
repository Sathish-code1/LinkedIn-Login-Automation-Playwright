# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: linkedin-login.spec.js >> LinkedIn Login Tests >> Invalid Credentials
- Location: tests\linkedin-login.spec.js:24:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for getByText('Wrong email or password.') to be visible
    - waiting for "https://www.linkedin.com/checkpoint/challenge/AQHBmOr6jay3EwAAAaA54uIchXWuh9I3MIT4_NXOQzeN42yfA4HBwVsOhGk8x88MevRJ_wIABakM6MBWtlhYzk-yENEnMw/?ut=171wQBRTR2Eso1" navigation to finish...
    - navigated to "https://www.linkedin.com/checkpoint/challenge/AQHBmOr6jay3EwAAAaA54uIchXWuh9I3MIT4_NXOQzeN42yfA4HBwVsOhGk8x88MevRJ_wIABakM6MBWtlhYzk-yENEnMw/?ut=171wQBRTR2Eso1"

```

# Page snapshot

```yaml
- generic [ref=f9e2]:
  - banner [ref=f9e3]:
    - generic [ref=f9e5]:
      - link "LinkedIn" [ref=f9e6] [cursor=pointer]:
        - /url: /
      - link "Sign in" [ref=f9e10] [cursor=pointer]:
        - /url: /checkpoint/lg/login?trk=hb_signin
      - link "Join now" [ref=f9e11] [cursor=pointer]:
        - /url: /signup/cold-join
  - main [ref=f9e12]:
    - heading "Let’s do a quick security check" [level=1] [ref=f9e14]
    - iframe [ref=f9e15]:
      - generic [ref=f10e2]:
        - banner
        - main [ref=f10e3]:
          - iframe [ref=f10e7]:
            - generic [ref=f17e2]:
              - generic [ref=f17e3]:
                - checkbox "I'm not a robot" [ref=f17e7]
                - generic [ref=f17e9]: I'm not a robot
              - generic [ref=f17e12]: reCAPTCHA
  - contentinfo [ref=f9e16]:
    - generic [ref=f9e17]:
      - paragraph [ref=f9e18]:
        - emphasis [ref=f9e32]:
          - generic: LinkedIn
          - text: © 2026
      - list "Footer Legal Menu" [ref=f9e34]:
        - listitem [ref=f9e35]:
          - link "User Agreement" [ref=f9e36] [cursor=pointer]:
            - /url: /legal/user-agreement?trk=d_checkpoint_ch_captchaV2Challenge_ft_user_agreement
        - listitem [ref=f9e37]:
          - link "Privacy Policy" [ref=f9e38] [cursor=pointer]:
            - /url: /legal/privacy-policy?trk=d_checkpoint_ch_captchaV2Challenge_ft_privacy_policy
        - listitem [ref=f9e39]:
          - link "Community Guidelines" [ref=f9e40] [cursor=pointer]:
            - /url: /help/linkedin/answer/34593?lang=en&trk=d_checkpoint_ch_captchaV2Challenge_ft_community_guidelines
        - listitem [ref=f9e41]:
          - link "Cookie Policy" [ref=f9e42] [cursor=pointer]:
            - /url: /legal/cookie-policy?trk=d_checkpoint_ch_captchaV2Challenge_ft_cookie_policy
        - listitem [ref=f9e43]:
          - link "Copyright Policy" [ref=f9e44] [cursor=pointer]:
            - /url: /legal/copyright-policy?trk=d_checkpoint_ch_captchaV2Challenge_ft_copyright_policy
        - listitem [ref=f9e45]:
          - link "Send Feedback" [ref=f9e46] [cursor=pointer]:
            - /url: /help/linkedin?trk=d_checkpoint_ch_captchaV2Challenge_ft_send_feedback&lang=en
```

# Test source

```ts
  1  | const fs = require('fs');
  2  | const path = require('path');
  3  | const { parse } = require('csv-parse/sync');
  4  | const { test } = require('../fixtures/testFixtures');
  5  | const { expect } = require('@playwright/test');
  6  | 
  7  | const csvPath = path.join(
  8  |     __dirname,
  9  |     '../test-data/loginData.csv'
  10 | );
  11 | 
  12 | const loginData = parse(
  13 |     fs.readFileSync(csvPath),
  14 |     {
  15 |         columns: true,
  16 |         skip_empty_lines: true
  17 |     }
  18 | );
  19 | 
  20 | test.describe('LinkedIn Login Tests', () => {
  21 | 
  22 |     for (const data of loginData) {
  23 | 
  24 |         test(data.testCase, async ({ page, loginPage }) => {
  25 | 
  26 |             await page.goto('https://www.linkedin.com/login');
  27 | 
  28 |             await loginPage.login(
  29 |                 data.email,
  30 |                 data.password
  31 |             );
  32 | 
  33 |             switch (data.expectedResult) {
  34 | 
  35 | 
  36 |                 case 'validCredentials':
  37 | 
  38 |                     await expect(page).toHaveURL(/linkedin\.com\/feed/);
  39 |                     break;
  40 | 
  41 |                 case 'invalidCredentials':
  42 | 
  43 |                     const invalidError = loginPage.invalidCredentialsError;
  44 |                     const securityChallenge = page.getByText("Let's do a quick security check");
  45 | 
  46 |                     await Promise.race([
> 47 |                         invalidError.waitFor({ state: 'visible', timeout: 5000 }),
     |                                      ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  48 |                         securityChallenge.waitFor({ state: 'visible', timeout: 5000 })
  49 |                     ]);
  50 | 
  51 |                     if (await invalidError.isVisible()) {
  52 |                         console.log("Invalid credentials message displayed");
  53 |                     } 
  54 |                     else if (await securityChallenge.isVisible()) {
  55 |                         console.log("LinkedIn security challenge displayed");
  56 |                     }
  57 | 
  58 |                     break;
  59 | 
  60 |                 case 'emptyPassword':
  61 | 
  62 |                     await expect(
  63 |                         loginPage.emptypass.nth(1)
  64 |                     ).toBeVisible();
  65 | 
  66 |                     break;
  67 | 
  68 |                 case 'emptyEmail':
  69 | 
  70 |                     await expect(
  71 |                         loginPage.emptyemail.nth(1)
  72 |                     ).toBeVisible();
  73 | 
  74 |                     break;
  75 | 
  76 |                 case 'invalidEmailFormat':
  77 | 
  78 |                     await expect(
  79 |                         loginPage.invalidEmailFormatError.nth(1)
  80 |                     ).toBeVisible();
  81 | 
  82 |                     break;
  83 |             }
  84 | 
  85 |         });
  86 | 
  87 |     }
  88 | 
  89 | });
```