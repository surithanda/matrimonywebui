describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('h3').should('contain', 'Login to Chaturvarnam');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify').should('contain', 'Login failed');
  });

  it('should navigate to OTP page on successful login', () => {
    cy.get('input[name="email"]').type('b4xabhishek@gmail.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify').should('contain', 'Login successful');
    cy.url().should('include', '/otp');
  });

  it('should navigate to register page', () => {
    cy.contains('Register Now').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });
}); 