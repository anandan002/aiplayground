# Requirement Traceability and Preventing Hallucination

## Learning Objectives

By the end of this module, you will be able to:

- Define AI hallucination in the context of code generation and explain why it occurs
- Identify the most common hallucination patterns in AI-generated code
- Verify AI-generated code against actual APIs, libraries, and requirements
- Implement a traceability workflow that ties generated code to real requirements
- Use techniques like documentation injection and library verification to prevent hallucination
- Distinguish between creative AI problem-solving and fabricated outputs
- Apply a systematic validation workflow before accepting any AI-generated code

---

## What Is AI Hallucination in Code Generation?

In the context of code generation, **hallucination** occurs when an AI produces code that references things that do not exist, uses incorrect APIs, or asserts facts about libraries or frameworks that are false.

The AI does not "know" it is hallucinating. It generates the most probable next token based on its training data. If the training data included many functions named `findOrCreate`, the model might suggest it for a library that does not have that method.

### Why Hallucination Happens

1. **Pattern matching, not knowledge retrieval.** LLMs do not look up documentation. They predict likely code based on patterns they have seen.

2. **Training data staleness.** The model was trained on code from a specific date range. APIs change. Libraries release new versions. The model does not know about updates.

3. **Blending similar libraries.** The model has seen Mongoose, Sequelize, Prisma, TypeORM, and dozens of other ORMs. It may blend method names from different libraries.

4. **Confident by default.** LLMs have no mechanism for expressing uncertainty. They produce output with equal confidence whether it is correct or fabricated.

5. **Context pressure.** When you ask for something specific and the model does not have a real answer, it will generate something plausible rather than saying "I don't know."

---

## Common Hallucination Patterns

### Pattern 1: Fake API Methods

The model invents methods that look plausible but do not exist.

```typescript
// Hallucinated: Prisma does not have a `findOneAndUpdate` method
// (That is a MongoDB/Mongoose method)
const user = await prisma.user.findOneAndUpdate(
  { where: { id: userId } },
  { data: { lastLogin: new Date() } }
);

// Actual Prisma API:
const user = await prisma.user.update({
  where: { id: userId },
  data: { lastLogin: new Date() },
});
```

### Pattern 2: Wrong Method Signatures

The method exists, but the parameters or return type are wrong.

```python
# Hallucinated: requests.get does not have a `retries` parameter
response = requests.get(url, retries=3, timeout=10)

# Actual API: retries require a custom adapter
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retries = Retry(total=3, backoff_factor=1)
session.mount('https://', HTTPAdapter(max_retries=retries))
response = session.get(url, timeout=10)
```

### Pattern 3: Invented Libraries

The model suggests installing a package that does not exist or has a different name.

```bash
# Hallucinated: this package does not exist
npm install express-rate-limiter

# Actual package:
npm install express-rate-limit
```

### Pattern 4: Deprecated or Removed APIs

The model references an API that existed in an older version but has been removed.

```javascript
// Hallucinated: componentWillMount was deprecated in React 16.3 and removed in React 19
class MyComponent extends React.Component {
  componentWillMount() {
    // This lifecycle method was removed in React 19
  }
}

// Correct modern React approach:
function MyComponent() {
  useEffect(() => {
    // Initialization logic here
  }, []);
}
```

### Pattern 5: Incorrect Configuration

The model generates configuration that looks right but has wrong property names or values.

```json
// Hallucinated: tsconfig.json with non-existent options
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strictNullChecks": true,
    "enableImplicitConversion": true,  // Does not exist
    "autoResolveModules": true          // Does not exist
  }
}
```

### Pattern 6: Fabricated Error Codes or Constants

```python
# Hallucinated: HTTP 419 is not a standard status code
# (It exists in some frameworks like Laravel but is non-standard)
return Response(status_code=419, detail="Page Expired")

# The model may also invent error constants:
from http import HTTPStatus
# HTTPStatus.UNPROCESSABLE exists (422)
# HTTPStatus.PAYMENT_REQUIRED exists (402)
# HTTPStatus.ENHANCE_YOUR_CALM does not exist in Python's http module
```

---

## How to Verify AI-Generated Code

### Verification Strategy 1: Check Imports

Every import statement is a claim about a dependency. Verify each one.

```typescript
// AI generated this file. Verify each import.
import { z } from 'zod';                    // Check: Is zod in package.json?
import { Router } from 'express';            // Check: Is express in package.json?
import { createClient } from 'redis';        // Check: Is redis in package.json?
import { validateSchema } from '@/utils';    // Check: Does this file/function exist?
import { RateLimiter } from 'rate-limiter-flexible'; // Check: Is this the right package name?
```

**Quick verification command:**
```bash
# Check if a package exists on npm
npm info rate-limiter-flexible

# Check what is actually installed
npm ls redis

# Verify a local import exists
ls -la src/utils/index.ts
```

### Verification Strategy 2: API Documentation Check

For every external API call, verify the method signature against official documentation.

```typescript
// AI generated this Redis code. Is the API correct?
const client = createClient({ url: 'redis://localhost:6379' });
await client.connect();
await client.set('key', 'value', { EX: 3600 }); // Is this the right syntax?

// Verification: Check the 'redis' npm package docs
// For redis@4.x: Yes, this is correct
// For redis@3.x: No, the API was client.set('key', 'value', 'EX', 3600)
```

**Use Context7 or official docs:**
```
> Use Context7 to look up the redis npm package documentation
  for the `set` command with expiration options.
```

### Verification Strategy 3: Run the Code

The most reliable verification is execution:

```bash
# Type checking catches many hallucinated APIs
npx tsc --noEmit

# Unit tests verify behavior
npm test

# Quick smoke test for a specific function
node -e "const { myFunction } = require('./dist/myModule'); console.log(myFunction('test'))"
```

### Verification Strategy 4: Compare with Known-Good Code

If you have existing working code that does something similar, compare the AI's approach:

```
> Show me the difference between what you generated for the auth
  middleware and the existing rateLimiter middleware in terms of
  patterns and API usage.
```

### Verification Strategy 5: Ask the AI to Verify Itself

This is imperfect (the model may confirm its own hallucination), but it can catch some issues:

```
> For each external API call in the code you just generated,
  list the package name, version requirement, and the specific
  method being called. For each method, confirm it exists in
  the current version of the package.
```

---

## Requirement Traceability

Traceability means being able to trace every piece of generated code back to a specific requirement. This prevents the AI from generating code that solves the wrong problem.

### The Traceability Chain

```
Requirement Document
  |
  v
User Story / Acceptance Criteria
  |
  v
Prompt to AI (references specific requirements)
  |
  v
Generated Code (implements specific requirements)
  |
  v
Tests (verify specific requirements)
  |
  v
Review (confirms code matches requirements)
```

### Implementing Traceability in Prompts

**Bad prompt (no traceability):**
```
Create a user registration endpoint.
```

**Good prompt (traceable to requirements):**
```
Implement user registration per the following requirements:

REQ-001: Email must be unique and validated (RFC 5322 format)
REQ-002: Password must be at least 8 characters with 1 uppercase,
         1 lowercase, 1 number, and 1 special character
REQ-003: On successful registration, send a verification email
REQ-004: Return 201 with user object (excluding password)
REQ-005: Return 409 if email already exists
REQ-006: Return 400 with specific validation error messages

For each requirement, add a comment in the code referencing
the requirement ID. Write tests that explicitly reference
which requirement they verify.
```

**The resulting code should trace back:**

```typescript
// REQ-001: Email validation
const emailSchema = z.string().email('Invalid email format');

// REQ-002: Password strength validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');
```

```typescript
// Tests trace to requirements
describe('User Registration', () => {
  // REQ-001
  it('rejects invalid email formats', async () => { /* ... */ });

  // REQ-002
  it('rejects passwords shorter than 8 characters', async () => { /* ... */ });
  it('rejects passwords without uppercase letters', async () => { /* ... */ });

  // REQ-005
  it('returns 409 when email already exists', async () => { /* ... */ });
});
```

### Gap Analysis

After generating code, verify coverage:

```
> List all the requirements (REQ-001 through REQ-006) and for each one,
  show me:
  1. The code that implements it (file and line number)
  2. The test that verifies it (file and line number)
  3. Any requirement that is NOT covered
```

---

## Techniques for Preventing Hallucination

### Technique 1: Provide API Documentation Directly

Instead of letting the AI guess at APIs, provide the documentation:

```
Here is the relevant section from the Stripe API docs:

stripe.charges.create({
  amount: number (in cents),
  currency: string (3-letter ISO code),
  source: string (token or card ID),
  description: string (optional),
  metadata: object (optional)
})

Returns a Charge object with fields: id, amount, currency, status, ...

Using this exact API, implement the payment processing function.
```

### Technique 2: Use Context7 for Library Documentation

Claude Code can look up current library documentation via Context7:

```
> Before implementing the S3 upload function, use Context7 to look up
  the current AWS SDK v3 documentation for the PutObjectCommand.
  Use the actual API from the docs, not from memory.
```

### Technique 3: Provide Your package.json

```
Here are the dependencies we are using (from package.json):
{
  "express": "^4.18.2",
  "prisma": "^5.10.0",
  "@prisma/client": "^5.10.0",
  "zod": "^3.22.0",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1"
}

Only use APIs from these specific versions. Do not suggest
additional dependencies without explicitly noting it.
```

### Technique 4: Reference Existing Code

```
> Read the existing payment service in src/services/payment.service.ts.
  Follow the exact same patterns and library usage when implementing
  the refund functionality.
```

### Technique 5: Explicit Version Pinning in Prompts

```
> We are using:
  - Node.js 22 LTS
  - TypeScript 5.x
  - Express 4 (NOT Express 5 -- the API is different)
  - Prisma 5 with PostgreSQL
  - Vitest (or Jest 29) for testing
>
> Use only APIs available in these specific versions.
```

---

## Red Flags vs. Creative Solutions

Not every unfamiliar code pattern is a hallucination. Sometimes the AI suggests a legitimate approach you have not seen before.

### Red Flags (Likely Hallucination)

| Signal | Example | Action |
|--------|---------|--------|
| Method name does not appear in docs | `prisma.user.findOneAndUpdate()` | Verify against official docs |
| Package name cannot be found on npm | `npm install express-auth-helper` | Search npm registry |
| Configuration option is unfamiliar | `"enableAutoFixing": true` in tsconfig | Check TSConfig reference |
| Error code or constant is non-standard | `HTTP 419 Page Expired` | Check HTTP spec |
| Syntax mixes two different libraries | MongoDB-style queries in Prisma | Compare against correct library docs |

### Green Flags (Likely Creative Solution)

| Signal | Example | Action |
|--------|---------|--------|
| Uses documented but obscure API | `Array.prototype.flatMap()` | Verify on MDN, then accept |
| Suggests a design pattern you haven't used | Strategy pattern for validators | Evaluate the approach on merits |
| Uses a standard library in an novel way | `AbortController` for timeout | Verify it is valid usage |
| Combines familiar concepts | Combining generics with mapped types | Check TypeScript docs |
| Suggests a newer API | `using` keyword for resource management | Verify it is available in your runtime |

### The Verification Decision Tree

```
AI generated something unfamiliar
  |
  +-- Is it an external API call?
  |     YES -> Verify against official docs
  |     NO  -> Continue
  |
  +-- Is it an import?
  |     YES -> Check package.json / npm registry
  |     NO  -> Continue
  |
  +-- Is it a configuration option?
  |     YES -> Check config reference docs
  |     NO  -> Continue
  |
  +-- Is it a language feature?
  |     YES -> Check language spec for your target version
  |     NO  -> Continue
  |
  +-- Is it a design pattern or approach?
        YES -> Evaluate on merits (readability, correctness, performance)
        This is likely creative problem-solving, not hallucination
```

---

## The Validation Workflow

### Step-by-Step Process

```
Step 1: GENERATE
  Ask the AI to generate the code.
  Include requirements, constraints, and API documentation.

Step 2: REVIEW
  Read every line of the generated code.
  Flag any unfamiliar APIs, methods, or patterns.

Step 3: VERIFY
  For each flag:
  - Check the official documentation
  - Search the npm registry for packages
  - Verify method signatures match your installed version
  - Confirm configuration options exist

Step 4: TEST
  Run the code:
  - Type checking (tsc --noEmit)
  - Linting (eslint)
  - Unit tests
  - Manual smoke testing for critical paths

Step 5: TRACE
  For each requirement:
  - Confirm corresponding implementation exists
  - Confirm corresponding test exists
  - Document the mapping

Step 6: ACCEPT (or REJECT and REGENERATE)
  If all checks pass, accept the code.
  If not, provide specific feedback and regenerate.
```

### Automated Verification Helpers

Create scripts that automate parts of the verification:

```bash
#!/bin/bash
# verify-ai-output.sh -- Quick checks for AI-generated code

echo "=== Type Checking ==="
npx tsc --noEmit

echo "=== Linting ==="
npx eslint src/ --ext .ts

echo "=== Tests ==="
npm test

echo "=== Unused Imports ==="
npx ts-prune

echo "=== Dependency Check ==="
# Verify all imports resolve to installed packages
npx depcheck

echo "=== Security Audit ==="
npm audit
```

```typescript
// verify-imports.ts -- Check that all imports resolve
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

function verifyImports(filePath: string): string[] {
  const issues: string[] = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;

      // Check external packages
      if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('@/')) {
        const packageName = moduleSpecifier.startsWith('@')
          ? moduleSpecifier.split('/').slice(0, 2).join('/')
          : moduleSpecifier.split('/')[0];

        const packageJsonPath = path.join('node_modules', packageName, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
          issues.push(`Package not installed: ${packageName} (imported in ${filePath})`);
        }
      }

      // Check local imports
      if (moduleSpecifier.startsWith('.')) {
        const resolved = path.resolve(path.dirname(filePath), moduleSpecifier);
        const candidates = [
          resolved + '.ts',
          resolved + '.tsx',
          resolved + '/index.ts',
          resolved + '/index.tsx',
        ];
        if (!candidates.some(c => fs.existsSync(c))) {
          issues.push(`Local import not found: ${moduleSpecifier} (in ${filePath})`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return issues;
}
```

---

## Exercise

### Hallucination Detection Lab

**Goal:** Deliberately trigger AI hallucination, then practice the verification workflow to catch and correct it.

**Part 1: Trigger Hallucination**

Give the AI prompts designed to increase the chance of hallucination:

1. **Obscure library:** Ask the AI to use a less popular library (e.g., a specific GraphQL client or a niche database driver) without providing documentation. Note what it generates.

2. **Version confusion:** Ask for code using "the latest version" of a library that recently had a major API change (e.g., React Router v6 vs v5, or AWS SDK v3 vs v2).

3. **Fictional requirement:** Ask the AI to implement a feature using a configuration option or API that you made up. Does the AI push back, or does it generate code using your fictional API?

**Part 2: Verify and Catch**

For each output from Part 1:
1. Apply the Verification Decision Tree
2. Check every import against npm/your package.json
3. Verify every method call against official docs
4. Run type checking and note which errors correspond to hallucinations

**Part 3: Correct and Regenerate**

For each hallucination you found:
1. Provide the correct API documentation to the AI
2. Ask it to regenerate using the real API
3. Compare the hallucinated version vs. the corrected version
4. Verify the corrected version passes all checks

**Part 4: Build a Traceability Map**

Take a set of 5 requirements for a small feature. Ask the AI to implement it. Then:
1. Create a traceability matrix (requirement -> code -> test)
2. Identify any requirements with no corresponding implementation
3. Identify any generated code that does not trace to a requirement
4. Identify any tests that do not clearly verify a specific requirement

**Document your findings:**
- How many hallucinations did you catch in total?
- Which patterns were most common?
- Which verification technique caught the most issues?
- How much time did verification add to the workflow? Was it worth it?
