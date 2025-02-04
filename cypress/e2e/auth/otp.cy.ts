describe('OTP Verification Flow', () => {
  beforeEach(() => {
    // Login first to get to OTP page
    cy.login('test@example.com', 'password123');
  });

  it('should display OTP form', () => {
    cy.get('h3').should('contain', 'Enter the OTP sent to your email');
    cy.get('input[type="text"]').should('have.length', 4);
    cy.get('button[type="submit"]').should('exist');
  });

  it('should redirect to login if no history_id', () => {
    // Clear localStorage to simulate no history_id
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/otp');
    cy.url().should('include', '/login');
    cy.get('.Toastify').should('contain', 'Please login first');
  });

  it('should verify OTP and redirect to dashboard', () => {
    // Enter OTP
    cy.enterOtp('1234');
    
    // Should show success message
    cy.get('.Toastify').should('contain', 'OTP Verified');
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Should store token in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('matrimony token')).to.exist;
    });
  });

  it('should show error for invalid OTP', () => {
    // Enter invalid OTP
    cy.enterOtp('0000');
    
    // Should show error message
    cy.get('.text-red-500').should('exist');
  });

  it('should navigate back to login page', () => {
    cy.contains('Login Now').click();
    cy.url().should('include', '/login');
  });
}); 