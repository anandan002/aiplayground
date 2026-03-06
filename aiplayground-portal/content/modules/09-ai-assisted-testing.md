# AI-Assisted Testing

## Learning Objectives

By the end of this module, you will be able to:

- Describe how AI tools accelerate testing across the development lifecycle
- Use GitHub Copilot to generate focused unit tests from existing code
- Use Claude Code to create comprehensive test suites spanning multiple files
- Apply test-driven development (TDD) with AI, writing tests first and letting AI implement
- Generate end-to-end tests using AI with browser automation
- Use AI for test data generation and edge case discovery
- Recognize when AI-generated tests are superficial and how to improve them

---

## How AI Helps with Testing

Testing is one of the highest-value applications of AI in development. Most developers under-test their code not because they think tests are unnecessary, but because writing tests is time-consuming and repetitive. AI removes that friction.

### Where AI Adds Testing Value

| Testing Activity | AI Value | How |
|-----------------|----------|-----|
| Unit test generation | Very high | AI reads the function and generates test cases |
| Edge case discovery | High | AI identifies inputs developers often miss |
| Test data generation | High | AI creates realistic, diverse test fixtures |
| Boilerplate reduction | Very high | AI generates describe/it blocks, mocks, setup |
| E2E test scripting | Medium-High | AI generates Playwright scripts from descriptions |
| Coverage gap identification | Medium | AI analyzes code paths and suggests missing tests |
| Test refactoring | Medium | AI updates tests when implementation changes |

### Where AI Falls Short

| Testing Activity | AI Limitation | Your Role |
|-----------------|--------------|-----------|
| Business logic verification | AI does not know your business rules | Define what "correct" means |
| Integration test design | AI may not understand your system boundaries | Specify what to mock vs. integrate |
| Performance testing thresholds | AI does not know your SLAs | Set the performance budgets |
| Flaky test diagnosis | AI cannot observe intermittent failures easily | Identify the flakiness pattern |

---

## Using Copilot to Generate Unit Tests

> **Note on test frameworks:** The examples in this module use Jest syntax (`jest.fn()`, `jest.spyOn()`), but the same patterns work with **Vitest**, which has become the preferred test runner for many new projects due to its speed and native ESM/TypeScript support. Vitest uses a Jest-compatible API, so the `describe`/`it`/`expect` syntax is identical. If you are starting a new project, consider using Vitest; for existing projects, Jest remains a solid choice.

### The Basic Workflow

1. Open the file you want to test
2. Open or create the corresponding test file
3. Write the first `describe` block and the first test name
4. Let Copilot generate the test body and subsequent tests

```typescript
// src/utils/validation.ts (the code to test)
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain a number');
  return { valid: errors.length === 0, errors };
}
```

```typescript
// src/utils/validation.test.ts
import { validateEmail, validatePassword } from './validation';

describe('validateEmail', () => {
  // Type this first test name, then let Copilot generate the body:
  it('returns true for valid email addresses', () => {
    // Copilot generates:
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('first.last@domain.co.uk')).toBe(true);
  });

  // Type the next test name:
  it('returns false for invalid email addresses', () => {
    // Copilot generates:
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
  });
});

// After writing the first describe block, Copilot often
// generates the second one automatically:
describe('validatePassword', () => {
  it('returns valid for a strong password', () => {
    const result = validatePassword('MyP@ssw0rd');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns errors for a short password', () => {
    const result = validatePassword('Ab1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Must be at least 8 characters');
  });
  // ... Copilot continues with more test cases
});
```

### Copilot Testing Tips

**Tip 1: Keep the source file open in a tab.** Copilot uses open tabs for context. If the source file is not open, Copilot has less information to work with.

**Tip 2: Write descriptive test names.** The test name is Copilot's primary signal for what to generate.

```typescript
// Vague name -- Copilot guesses what to test
it('handles edge case', () => {

// Specific name -- Copilot knows exactly what to generate
it('throws ValidationError when amount is negative', () => {
```

**Tip 3: Use the `/tests` command in Copilot Chat.** Select a function, type `/tests`, and Copilot generates a complete test file.

**Tip 4: Generate, then augment.** Accept Copilot's tests as a starting point, then manually add the edge cases it missed.

---

## Using Claude Code for Comprehensive Test Suites

Claude Code's advantage for testing is its ability to read the entire implementation and reason about what needs to be tested.

### Generating a Full Test Suite

```
> Read the UserService in src/services/user.service.ts and all the
  types in src/types/user.types.ts.
>
> Generate a comprehensive test suite covering:
> 1. All public methods
> 2. Happy path for each method
> 3. Error cases (invalid input, not found, duplicate, etc.)
> 4. Edge cases (empty strings, null, boundary values)
> 5. Async error handling (database failures, timeout)
>
> Use the test factory pattern from src/__tests__/factories/
> Mock the database using the existing mock in src/__tests__/mocks/db.ts
> Follow the test patterns in src/__tests__/services/auth.service.test.ts
```

### Analyzing Coverage Gaps

```
> Run the test coverage report: `npx jest --coverage`
>
> Analyze the output and identify:
> 1. Files with less than 80% coverage
> 2. Specific uncovered branches or lines
> 3. The most impactful tests to add (most coverage gain per test)
>
> Then generate the missing tests for the top 3 coverage gaps.
```

### Testing Complex Interactions

Claude Code excels when tests require understanding multiple files:

```
> The payment flow involves:
> - src/routes/payment.routes.ts (endpoint)
> - src/services/payment.service.ts (business logic)
> - src/services/stripe.service.ts (Stripe API wrapper)
> - src/repositories/payment.repository.ts (database)
>
> Read all four files and generate integration tests that:
> 1. Test the full flow from route to database
> 2. Mock only the Stripe API (use the real database via test container)
> 3. Test the payment creation, capture, and refund flows
> 4. Test error scenarios (Stripe failure, database failure, invalid input)
```

---

## Test-Driven Development with AI

TDD with AI inverts the traditional workflow: you write the test (your specification), then let the AI write the implementation that passes it.

### The AI-TDD Workflow

```
Step 1: You write the test (the specification)
Step 2: You verify the test fails (no implementation yet)
Step 3: AI writes the implementation
Step 4: You verify the test passes
Step 5: AI refactors for quality
Step 6: You verify tests still pass
```

### Example: TDD with Claude Code

```
> I am going to write the tests first. Do not write any implementation
  until I tell you to.
```

You write the test:

```typescript
// src/services/pricing.test.ts
import { calculatePrice } from './pricing.service';

describe('calculatePrice', () => {
  it('returns base price for quantity of 1', () => {
    expect(calculatePrice({ basePrice: 100, quantity: 1 })).toBe(100);
  });

  it('applies 10% discount for quantity 10-49', () => {
    expect(calculatePrice({ basePrice: 100, quantity: 10 })).toBe(900);
    expect(calculatePrice({ basePrice: 100, quantity: 49 })).toBe(4410);
  });

  it('applies 20% discount for quantity 50-99', () => {
    expect(calculatePrice({ basePrice: 100, quantity: 50 })).toBe(4000);
  });

  it('applies 30% discount for quantity 100+', () => {
    expect(calculatePrice({ basePrice: 100, quantity: 100 })).toBe(7000);
  });

  it('throws for zero or negative quantity', () => {
    expect(() => calculatePrice({ basePrice: 100, quantity: 0 })).toThrow();
    expect(() => calculatePrice({ basePrice: 100, quantity: -1 })).toThrow();
  });

  it('throws for negative base price', () => {
    expect(() => calculatePrice({ basePrice: -1, quantity: 1 })).toThrow();
  });

  it('handles decimal base prices correctly', () => {
    const result = calculatePrice({ basePrice: 19.99, quantity: 3 });
    expect(result).toBeCloseTo(59.97, 2);
  });
});
```

Then:

```
> Now read the test file I just wrote at src/services/pricing.test.ts.
  Implement the calculatePrice function in src/services/pricing.service.ts
  that makes all these tests pass. Run the tests to verify.
```

### Why TDD + AI Works Well

1. **Tests are your specification.** The AI knows exactly what "correct" means because you defined it.
2. **Edge cases are pre-defined.** You thought about the edge cases before the AI started coding.
3. **Verification is automatic.** Run the tests to know immediately if the implementation is correct.
4. **The AI focuses on implementation, not design.** The design decisions are in the tests.

---

## E2E Test Generation with AI

### Generating Playwright Tests

```
> Generate Playwright E2E tests for the user registration flow:
>
> 1. Navigate to /register
> 2. Fill in the form: name, email, password, confirm password
> 3. Click the register button
> 4. Verify redirect to /verify-email page
> 5. Verify success message is displayed
>
> Also test error cases:
> - Submit with empty fields (verify validation messages)
> - Submit with mismatched passwords
> - Submit with an already registered email
>
> Use the Page Object Model pattern.
```

The AI generates:

```typescript
// e2e/pages/RegisterPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Full Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.errorMessages = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string, confirmPassword: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
  }
}

// e2e/tests/registration.spec.ts
import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('User Registration', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('successful registration redirects to verification page', async ({ page }) => {
    await registerPage.register(
      'John Doe',
      `test-${Date.now()}@example.com`,
      'SecureP@ss123',
      'SecureP@ss123'
    );
    await expect(page).toHaveURL('/verify-email');
    await expect(page.getByText('Check your email')).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await registerPage.registerButton.click();
    await expect(registerPage.errorMessages.first()).toBeVisible();
  });

  test('shows error for mismatched passwords', async ({ page }) => {
    await registerPage.register(
      'John Doe',
      'test@example.com',
      'SecureP@ss123',
      'DifferentP@ss456'
    );
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});
```

### Important: E2E Tests Require Verification

AI-generated E2E tests are particularly prone to issues because:
- Locator strategies may not match your actual HTML structure
- Wait conditions may be insufficient for dynamic content
- Test data setup/teardown may be incomplete

**Always run E2E tests against the actual application and fix locator issues.**

---

## Coverage Analysis and Gap Identification

### Using AI to Find Testing Gaps

```
> Run the coverage report (e.g., `npx jest --coverage --coverageReporters=json`
  or `npx vitest run --coverage`) and read the coverage output file.
>
> For src/services/order.service.ts, identify:
> 1. Which functions have 0% coverage (no tests at all)
> 2. Which branches are not covered (if-else paths not tested)
> 3. Which lines are not executed during tests
>
> For each gap, suggest a specific test case that would cover it.
```

### Strategic Coverage Improvement

Not all coverage gaps are equal. Focus AI-generated tests on:

```
Priority 1: Business-critical functions with 0% coverage
Priority 2: Error handling paths (catch blocks, error conditions)
Priority 3: Boundary conditions (off-by-one, empty collections, max values)
Priority 4: Happy path variations (different valid inputs)
Priority 5: Edge cases in utility functions
```

```
> Analyze the coverage report and generate tests in priority order.
  Start with Priority 1 (zero-coverage business-critical functions)
  and work down. Stop after achieving 80% overall coverage.
```

---

## AI for Test Data Generation

### Generating Realistic Test Fixtures

```
> Generate test fixture data for the Order module:
>
> - 10 sample orders with realistic data
> - Mix of statuses: pending, processing, shipped, delivered, cancelled
> - Various product quantities and prices
> - Some orders with discounts, some without
> - Include edge cases: order with 1 item, order with 50 items,
>   order with total of $0.01, order with total of $99,999.99
>
> Use the Order type from src/types/order.types.ts
> Output as a TypeScript file exporting a typed array.
```

The AI generates:

```typescript
// src/__tests__/fixtures/orders.ts
import { Order, OrderStatus } from '../../types/order.types';

export const sampleOrders: Order[] = [
  {
    id: 'ord_001',
    userId: 'usr_100',
    status: OrderStatus.DELIVERED,
    items: [
      { productId: 'prod_001', name: 'Wireless Mouse', quantity: 1, unitPrice: 29.99 },
      { productId: 'prod_002', name: 'USB-C Cable', quantity: 3, unitPrice: 12.99 },
    ],
    subtotal: 68.96,
    discount: 0,
    tax: 5.52,
    total: 74.48,
    createdAt: new Date('2025-01-15T10:30:00Z'),
    updatedAt: new Date('2025-01-20T14:22:00Z'),
  },
  // ... 9 more orders with varying characteristics
];

// Edge case fixtures
export const minimalOrder: Order = {
  id: 'ord_edge_001',
  userId: 'usr_200',
  status: OrderStatus.PENDING,
  items: [{ productId: 'prod_099', name: 'Sticker', quantity: 1, unitPrice: 0.01 }],
  subtotal: 0.01,
  discount: 0,
  tax: 0,
  total: 0.01,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const largeOrder: Order = {
  id: 'ord_edge_002',
  userId: 'usr_201',
  status: OrderStatus.PROCESSING,
  items: Array.from({ length: 50 }, (_, i) => ({
    productId: `prod_${i + 1}`,
    name: `Product ${i + 1}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    unitPrice: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
  })),
  subtotal: 99999.99,
  discount: 0,
  tax: 8000.00,
  total: 107999.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Generating Edge Case Inputs

```
> For the validateAddress function, generate a list of 20 edge case
  inputs that should be tested. Include:
> - International addresses (Japan, Germany, UAE)
> - Addresses with special characters
> - Very long address lines
> - Missing required fields
> - PO Box addresses
> - Military/APO addresses
> - Addresses with apartment/suite/unit numbers
> - Unicode characters in names
```

---

## Limitations: Tests That Pass but Do Not Test the Right Things

The biggest risk with AI-generated tests is **false confidence**. The tests pass, coverage is high, but the tests do not actually verify meaningful behavior.

### Red Flags in AI-Generated Tests

**Red Flag 1: Tautological tests**

```typescript
// This test does not verify anything useful
it('returns the result of createUser', async () => {
  const mockResult = { id: '1', name: 'John' };
  jest.spyOn(db, 'createUser').mockResolvedValue(mockResult);

  const result = await userService.createUser({ name: 'John' });

  // This just verifies the mock returns what we told it to return
  expect(result).toEqual(mockResult);
});
```

**Red Flag 2: Testing implementation details**

```typescript
// Brittle: breaks if you refactor without changing behavior
it('calls the database with the correct query', async () => {
  await userService.getUser('123');

  expect(db.query).toHaveBeenCalledWith(
    'SELECT * FROM users WHERE id = $1',
    ['123']
  );
  // If you optimize the query to select specific columns,
  // this test breaks even though behavior is correct
});
```

**Red Flag 3: Missing assertions**

```typescript
// No expect statement -- the test always passes
it('handles the error case', async () => {
  const result = await userService.createUser({ name: '' });
  // ... where is the assertion?
});
```

**Red Flag 4: Over-mocking**

```typescript
// Everything is mocked -- we are testing that mocks work, not our code
it('processes the payment', async () => {
  const mockStripe = { charges: { create: jest.fn().mockResolvedValue({ id: 'ch_1' }) } };
  const mockDb = { payments: { create: jest.fn().mockResolvedValue({ id: 'pay_1' }) } };
  const mockEmail = { send: jest.fn().mockResolvedValue(true) };

  const service = new PaymentService(mockStripe, mockDb, mockEmail);
  await service.processPayment({ amount: 100 });

  // We have verified that our code calls some functions.
  // We have NOT verified that payments actually work.
});
```

### How to Improve AI-Generated Tests

```
> Review the tests you just generated. For each test, answer:
> 1. What specific behavior does this test verify?
> 2. If the implementation had a subtle bug, would this test catch it?
> 3. Is this test testing our code or testing the mocking framework?
>
> Remove or rewrite any test that does not verify meaningful behavior.
```

### The Testing Quality Checklist

Apply this to every AI-generated test:

```markdown
- [ ] Each test has at least one meaningful assertion
- [ ] Tests verify behavior, not implementation details
- [ ] Mocks are minimal (only external dependencies)
- [ ] Edge cases are covered (null, empty, boundary, error)
- [ ] Test descriptions accurately describe what is tested
- [ ] Async tests properly await results
- [ ] Tests are independent (no shared mutable state between tests)
- [ ] Negative tests verify that bad input is rejected
```

---

## Exercise

### Generate a Full Test Suite

**Goal:** Use AI to generate a comprehensive test suite for a module, then critically evaluate and improve the results.

**Setup:** Use the following module (or a similar one from your project):

```typescript
// src/services/cart.service.ts
interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface CartService {
  getCart(userId: string): Promise<Cart>;
  addItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  removeItem(userId: string, productId: string): Promise<Cart>;
  updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart>;
  clearCart(userId: string): Promise<void>;
  getTotal(userId: string): Promise<{ subtotal: number; tax: number; total: number }>;
  applyPromoCode(userId: string, code: string): Promise<{ discount: number; newTotal: number }>;
}
```

**Part 1: AI-Generated Tests (15 minutes)**

Ask your AI tool to generate a complete test suite for `CartService`. Do not provide hints about edge cases -- let the AI figure them out.

**Part 2: Critical Review (15 minutes)**

Review every test the AI generated using the Testing Quality Checklist:
- Mark tests that are tautological or testing mocks
- Mark tests missing meaningful assertions
- Mark edge cases the AI missed (What about adding an item that is already in the cart? What about a promo code that has expired? What about concurrent modifications?)

**Part 3: Improve (15 minutes)**

1. Delete or rewrite the weak tests
2. Add the missing edge case tests
3. Ask the AI to generate tests for the specific gaps you identified
4. Run the final suite and verify all tests are meaningful

**Part 4: TDD Round**

Pick one method the AI did not test well (e.g., `applyPromoCode`). Write 5 tests for it yourself that cover:
- Valid promo code
- Expired promo code
- Already-used promo code
- Promo code with minimum cart value requirement
- Stacking multiple promo codes

Then ask the AI to implement `applyPromoCode` to pass your tests.

**Reflection:**
- What percentage of AI-generated tests were genuinely useful?
- Which types of tests did the AI generate best? Worst?
- Was the TDD approach (Part 4) more or less effective than generate-then-review (Parts 1-3)?
