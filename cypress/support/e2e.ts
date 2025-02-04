import '@testing-library/cypress/add-commands';

// Cypress commands for common operations
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('enterOtp', (otp: string) => {
  const otpDigits = otp.split('');
  cy.get('input[type="text"]').each(($input, index) => {
    if (otpDigits[index]) {
      cy.wrap($input).type(otpDigits[index]);
    }
  });
  cy.get('button[type="submit"]').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      enterOtp(otp: string): Chainable<void>;
    }
  }
} 