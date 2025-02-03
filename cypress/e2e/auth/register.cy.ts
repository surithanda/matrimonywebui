describe('Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form', () => {
    cy.get('h3').contains('LOGIN INFORMATION').should('exist');
    cy.get('h3').contains('PERSONAL INFORMATION').should('exist');
    cy.get('h3').contains('CONTACT INFORMATION').should('exist');
  });

  it('should show error when passwords do not match', () => {
    // Fill in login information
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password456');

    // Fill in required personal information
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('select[name="gender"]').select('Male');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="city"]').type('New York');
    cy.get('input[name="state"]').type('NY');
    cy.get('input[name="country"]').type('USA');
    cy.get('input[name="zipCode"]').type('10001');
    cy.get('input[name="primaryPhone"]').type('1234567890');

    cy.get('button').contains('Register').click();
    cy.get('.Toastify').should('contain', 'Passwords do not match');
  });

  it('should successfully register a new user', () => {
    const email = `test${Date.now()}@example.com`;

    // Fill in login information
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');

    // Fill in required personal information
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('select[name="gender"]').select('Male');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="city"]').type('New York');
    cy.get('input[name="state"]').type('NY');
    cy.get('input[name="country"]').type('USA');
    cy.get('input[name="zipCode"]').type('10001');
    cy.get('input[name="primaryPhone"]').type('1234567890');

    cy.get('button').contains('Register').click();
    cy.get('.Toastify').should('contain', 'Registration successful');
    cy.url().should('include', '/login');
  });

  it('should clear form when clicking cancel', () => {
    // Fill in some fields
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="firstName"]').type('John');

    // Click cancel
    cy.get('button').contains('Cancel').click();

    // Verify fields are cleared
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="firstName"]').should('have.value', '');
  });
}); 