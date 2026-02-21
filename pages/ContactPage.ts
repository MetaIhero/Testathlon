import { Page, Locator } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"], input[placeholder="Name"]').or(page.locator('label:has-text("Name") + input')).first();
    this.emailInput = page.locator('input[name="email"], input[placeholder="Email"]').or(page.locator('label:has-text("Email") + input')).first();
    this.phoneInput = page.locator('input[name="phone"], input[placeholder="Phone"]').or(page.locator('label:has-text("Phone") + input')).first();
    this.subjectInput = page.locator('input[name="subject"], input[placeholder="Subject"]').or(page.locator('label:has-text("Subject") + input')).first();
    this.messageTextarea = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').or(page.locator('label:has-text("Message") + textarea')).first();
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.locator('text=/thank|success|sent|received/i').first();
    this.errorMessages = page.locator('.alert-danger, .error, [class*="error"], [class*="alert"]');
  }

  async goto() {
    await this.page.goto('/#contact');
  }

  async fillContactForm(name: string, email: string, phone: string, subject: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.subjectInput.fill(subject);
    await this.messageTextarea.fill(message);
  }

  async submit() {
    await this.submitButton.click();
  }
}
