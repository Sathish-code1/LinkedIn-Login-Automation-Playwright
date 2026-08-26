class LoginPage {

    constructor(page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Email or phone' }).first();
        this.passwordInput = page.locator('input[type="password"]:visible');
        this.loginButton = page.getByRole('button', {
            name: 'Sign in',
            exact: true
        });     
        this.invalidCredentialsError = page.getByText('Wrong email or password.');
        this.emptyemail = page.locator('p', { hasText: 'Please enter an email address or phone number.' });
        this.emptypass = page.locator('p', { hasText: 'Please enter a password.' });
        this.invalidEmailFormatError = page.locator('p', { hasText: 'Please enter a valid email address.' });
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    // async getErrorMessage() {
    //     return await this.errorMessage.textContent();
    // }
}

module.exports = { LoginPage };