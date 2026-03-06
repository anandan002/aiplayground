# Multi-User AI Collaboration

## Learning Objectives

By the end of this module, you will be able to:

- Identify the challenges of multiple developers using AI tools on a shared codebase
- Create and maintain a team CLAUDE.md file that enforces coding standards
- Design branch strategies that accommodate AI-generated code changes
- Review AI-generated code effectively, knowing what to look for
- Prevent merge conflicts and pattern divergence when multiple people use AI
- Establish team workflows including approval gates for AI-generated code
- Share prompts, skills, and knowledge across a development team

---

## Challenges of Multiple Developers Using AI

When one developer uses AI tools, the impact is localized. When an entire team uses AI tools, new challenges emerge.

### Challenge 1: Style Divergence

Each developer prompts the AI differently. Developer A writes prompts that produce functional-style code. Developer B writes prompts that produce class-based code. The codebase becomes inconsistent.

```typescript
// Developer A's AI output (functional style)
const createUser = async (data: CreateUserInput): Promise<User> => {
  const validated = validateInput(data);
  const hashed = await hashPassword(validated.password);
  return db.user.create({ data: { ...validated, password: hashed } });
};

// Developer B's AI output (class-based style)
class UserService {
  async create(data: CreateUserInput): Promise<User> {
    const validated = this.validator.validate(data);
    const hashed = await this.hasher.hash(validated.password);
    return this.repository.create({ ...validated, password: hashed });
  }
}
```

Both are valid. Neither is wrong. But having both in the same codebase creates confusion and maintenance burden.

### Challenge 2: Conflicting AI Outputs

Two developers ask AI to implement the same feature on different branches. Each AI produces a valid but incompatible implementation. The merge is painful.

### Challenge 3: Review Burden

AI can generate code faster than humans can review it. When every developer is generating large volumes of code, the review pipeline becomes a bottleneck.

### Challenge 4: Knowledge Gaps

When AI generates code, the developer who accepted it may not fully understand every detail. If that developer leaves or is unavailable, the team has code that nobody deeply understands.

### Challenge 5: Duplicate Solutions

Without coordination, two developers might ask AI to solve the same problem in different parts of the codebase, creating duplicate functionality.

---

## CLAUDE.md as Team Convention

The single most effective tool for team AI coordination is a shared **CLAUDE.md** file at the project root. This file acts as standing instructions that every team member's AI tools will follow.

### Essential Sections for a Team CLAUDE.md

```markdown
# Project: [Name]

## Team AI Usage Guidelines

### Code Style Requirements
- All new code must use TypeScript strict mode
- Use functional style: arrow functions, no classes unless wrapping state
- Named exports only, no default exports
- Explicit return types on all exported functions
- Use descriptive variable names (no single letters except loop indices)

### Architecture Patterns
- Route handlers call services. Services call repositories.
- Never access the database directly from route handlers.
- Business logic lives in services, not route handlers.
- Shared types go in src/types/. Domain types go in their module.

### Error Handling
- All errors must be instances of AppError (src/errors/AppError.ts)
- Route handlers must NOT catch errors (the error middleware handles them)
- Services throw specific error types: NotFoundError, ValidationError, etc.

### Testing Standards
- Every new service function needs a corresponding test
- Tests use the factory pattern from src/__tests__/factories/
- Mock external services, never mock internal modules
- Test file naming: [module].test.ts in the same directory

### File Naming Conventions
- Services: [name].service.ts
- Route handlers: [name].routes.ts
- Types: [name].types.ts
- Tests: [name].test.ts
- Utilities: [name].util.ts

### Commands
- npm run dev -- development server
- npm test -- run all tests
- npm run test:watch -- test in watch mode
- npm run typecheck -- TypeScript checking
- npm run lint -- ESLint
- npm run lint:fix -- auto-fix lint issues

### Things the AI Must NOT Do
- Do not modify .env files or committed configuration
- Do not add new npm dependencies without noting it in the PR description
- Do not modify database migration files that have already been applied
- Do not use console.log -- use the logger from src/utils/logger.ts
- Do not skip error handling to save time
```

### Keeping CLAUDE.md Updated

Treat CLAUDE.md like code:
- It lives in version control
- Changes require PR review
- Update it when team conventions change
- Review it quarterly for accuracy

### Directory-Level CLAUDE.md Files

For large projects, add CLAUDE.md files in subdirectories for module-specific conventions:

```markdown
<!-- src/api/CLAUDE.md -->
# API Module Conventions

## Route Handler Pattern
Every route handler must:
1. Extract and validate input using Zod schemas from ./schemas/
2. Call the appropriate service
3. Return the response using the responseHelper from ../utils/response.ts
4. NOT contain business logic -- delegate to services

## Response Format
All API responses must use this envelope:
{
  "data": <payload>,
  "meta": { "timestamp": "ISO string", "requestId": "uuid" },
  "error": null | { "code": "string", "message": "string" }
}
```

---

## Branch Strategies for AI-Generated Code

AI tools can generate large changes quickly. This requires adapting your branching strategy.

### The Feature-Per-AI-Session Pattern

```
main
 |
 +-- feature/add-audit-logging (Developer A, using Claude Code)
 |     Commits:
 |     - "scaffold audit logging module"
 |     - "implement audit middleware"
 |     - "add audit query endpoint"
 |     - "add tests for audit logging"
 |
 +-- feature/add-rate-limiting (Developer B, using Claude Code)
       Commits:
       - "implement rate limiter middleware"
       - "add rate limit configuration"
       - "add rate limiter tests"
```

**Rules:**
1. One feature branch per AI session/task
2. Commit frequently (after each logical step, not at the end)
3. Keep branches short-lived (merge within 1-2 days)
4. Rebase on main before opening PR

### Commit Messages for AI-Generated Code

Be transparent about AI usage in commit messages:

```bash
# Good: Clear about what was done and how
git commit -m "Add input validation to user endpoints

Implemented Zod schemas for create/update user requests.
Added validation middleware to all user routes.
AI-assisted implementation, manually reviewed and tested.

Co-Authored-By: Claude Code <noreply@anthropic.com>"

# Bad: No indication of AI involvement or review status
git commit -m "Add validation"
```

### Avoiding Large Diffs

AI tools can generate 1000+ line diffs in one session. This is hard to review. Break it up:

```
Instead of:
  One PR with 1200 lines across 15 files

Break into:
  PR 1: Types and interfaces (200 lines, 3 files)
  PR 2: Service implementation (300 lines, 2 files)
  PR 3: Route handlers (250 lines, 3 files)
  PR 4: Tests (400 lines, 4 files)
```

---

## Code Review for AI-Generated Code

Reviewing AI-generated code requires a different checklist than reviewing human-written code.

### What to Look For

#### 1. Hallucinated APIs and Libraries

AI models sometimes reference APIs that do not exist or use incorrect method signatures.

```typescript
// AI might generate this -- but does `findUniqueOrThrow` actually exist
// in your version of Prisma?
const user = await prisma.user.findUniqueOrThrow({
  where: { id: userId }
});

// Verify: Check the Prisma docs for your version
// In older Prisma versions, you need findUnique() with a manual null check
```

**Review action:** For every external API call, verify it exists in the installed package version.

#### 2. Subtle Logic Errors

AI code often *looks* correct but has edge case bugs.

```python
def calculate_discount(price: float, discount_percent: float) -> float:
    """AI-generated: looks correct at first glance."""
    return price * (1 - discount_percent / 100)

# Bug: What if discount_percent > 100? Returns negative price.
# Bug: What if price is negative? No validation.
# Bug: Floating point precision (0.1 + 0.2 != 0.3)
```

**Review action:** Trace through the logic with edge case inputs: zero, negative, maximum, null/undefined.

#### 3. Missing Error Handling

AI often generates the happy path well but skips error handling.

```javascript
// AI-generated: works perfectly when everything goes right
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data.user;
}

// Missing: What if the network request fails?
// Missing: What if the response is not JSON?
// Missing: What if the response is 404?
// Missing: What if data.user is undefined?
```

**Review action:** For every AI-generated function, ask "What happens when things go wrong?"

#### 4. Security Vulnerabilities

AI can produce code with security holes, especially around:
- Input validation (or lack thereof)
- SQL query construction
- Authentication/authorization checks
- Secret handling

```javascript
// AI-generated: SQL injection vulnerability
const query = `SELECT * FROM users WHERE name = '${name}'`;

// Should be:
const query = `SELECT * FROM users WHERE name = $1`;
const result = await db.query(query, [name]);
```

**Review action:** Specifically scan for OWASP Top 10 vulnerabilities (covered in Module 10).

#### 5. Performance Concerns

AI tends to prioritize correctness over performance. Look for:
- N+1 queries in loops
- Missing indexes on queried fields
- Unbounded data fetching (no LIMIT)
- Synchronous operations that should be async

```typescript
// AI-generated: N+1 query problem
async function getUsersWithPosts(userIds: string[]) {
  const users = await db.user.findMany({ where: { id: { in: userIds } } });
  // This queries the database once per user -- N+1 problem!
  for (const user of users) {
    user.posts = await db.post.findMany({ where: { userId: user.id } });
  }
  return users;
}

// Should use a single query with include/join
async function getUsersWithPosts(userIds: string[]) {
  return db.user.findMany({
    where: { id: { in: userIds } },
    include: { posts: true },
  });
}
```

### AI Code Review Checklist

```markdown
## AI-Generated Code Review Checklist

### Correctness
- [ ] Logic handles edge cases (null, empty, zero, negative, max values)
- [ ] API calls use correct methods and parameters for installed versions
- [ ] No hallucinated libraries or functions
- [ ] Types are correct and complete

### Security
- [ ] No SQL injection vulnerabilities
- [ ] Input is validated and sanitized
- [ ] No hardcoded secrets or credentials
- [ ] Auth checks are present where needed
- [ ] No sensitive data in logs or error messages

### Error Handling
- [ ] All async operations have error handling
- [ ] Error messages are helpful but do not leak internals
- [ ] Failures are logged appropriately
- [ ] Partial failure states are handled

### Performance
- [ ] No N+1 queries
- [ ] Database queries are bounded (LIMIT)
- [ ] No unnecessary synchronous blocking
- [ ] Large data sets are paginated

### Standards
- [ ] Follows team conventions (CLAUDE.md)
- [ ] Consistent with existing codebase patterns
- [ ] Tests are meaningful, not just present
- [ ] Documentation is accurate
```

---

## Preventing Conflicts and Pattern Divergence

### Naming Convention Enforcement

Without explicit conventions, AI tools will invent names. Two developers working on related features might get:

```
Developer A: userPreferencesController.ts, UserPreferencesService
Developer B: user_settings_handler.ts, SettingsManager
```

**Prevention:** Document naming patterns in CLAUDE.md (see above) and enforce via linting rules.

### Shared Utility Libraries

When AI generates utility functions, it tends to inline them rather than reuse existing ones. Two developers might end up with three different date formatting functions.

**Prevention:**
- Document existing utilities in CLAUDE.md: "Date formatting is in src/utils/date.ts"
- Add a section listing common utilities and their locations
- Review PRs for duplicate functionality

### Architecture Enforcement

```markdown
<!-- In CLAUDE.md -->
## Architecture Rules (Enforced in Review)

Data flow: Route Handler -> Service -> Repository -> Database
                                    ^
                                    |
                            Business logic here only

Violations that will be rejected in review:
- Route handlers calling repositories directly
- Services importing from route handler modules
- Business logic in utility functions
- Database queries outside repository files
```

---

## Team Workflows

### Who Reviews AI Code?

AI-generated code should be reviewed with the same rigor as human-written code. Some teams apply additional scrutiny:

| Review Level | When | Reviewers |
|-------------|------|-----------|
| Standard review | AI-generated feature code | 1 peer reviewer |
| Enhanced review | AI-generated security/auth code | 2 reviewers, 1 must be security-aware |
| Architecture review | AI-generated structural changes | Tech lead / architect |
| Skip review | AI-generated test-only changes (low risk) | Self-review with checklist |

### Approval Gates

Define clear gates for AI-generated changes:

```
Gate 1: Plan Approval
  Before the AI starts implementing, the developer presents
  the plan to the team (Slack message or brief sync).

Gate 2: Self-Review
  The developer who used AI reviews the generated code using
  the AI Code Review Checklist before opening a PR.

Gate 3: Peer Review
  A teammate reviews the PR with awareness that it is AI-generated
  (flag in PR description).

Gate 4: CI Validation
  All tests pass, linting passes, type checking passes.
  No decrease in test coverage.
```

### PR Template for AI-Generated Code

```markdown
## Description
[What this PR does]

## AI Tool Usage
- **Tool used:** Claude Code / GitHub Copilot / Other
- **Level of AI involvement:** Scaffolded / Partially generated / Fully generated
- **Human modifications:** [describe what you changed from AI output]
- **Review notes:** [areas that need extra scrutiny]

## Checklist
- [ ] I have read and understood all AI-generated code
- [ ] I have verified all API calls against documentation
- [ ] I have tested edge cases manually
- [ ] I have run the AI Code Review Checklist
- [ ] Tests cover the critical paths
- [ ] No new dependencies added without discussion
```

---

## Sharing Prompts and Skills

### Team Prompt Library

Create a shared directory of proven prompts:

```
.claude/
  commands/
    feature.md          -- Standard feature implementation workflow
    bugfix.md           -- Bug investigation and fix workflow
    review.md           -- Code review analysis
    refactor.md         -- Refactoring workflow
    test-coverage.md    -- Generate tests for uncovered code
  skills/
    api-endpoint.md     -- How to create a new API endpoint
    database-migration.md -- How to create a migration
    error-handling.md   -- Error handling patterns for this project
```

These files live in version control and evolve with the project.

### Documenting AI Decisions

When AI makes a significant suggestion that the team adopts, document it:

```markdown
<!-- docs/decisions/YYYY-MM-DD-caching-strategy.md -->
# Decision: Redis-Based API Response Caching

## Context
We needed to add caching to reduce database load on read-heavy endpoints.

## AI Involvement
Claude Code analyzed the codebase and recommended Redis-based caching with
a sliding window TTL strategy. It compared three approaches:
1. In-memory cache (rejected: does not work with multiple server instances)
2. Redis with fixed TTL (rejected: cold start problem after cache expires)
3. Redis with sliding window TTL (selected: balances freshness and performance)

## Decision
Adopted option 3 based on AI analysis and team discussion.

## Human Modifications
- Reduced default TTL from AI-suggested 1 hour to 15 minutes (our data changes frequently)
- Added cache invalidation on write operations (AI did not consider this initially)
- Added cache warm-up on deployment (AI suggested, team agreed)
```

---

## Knowledge Management

### What Happens When AI Writes Code Nobody Understands

This is a real risk. Mitigate it through:

1. **Mandatory understanding:** The developer who uses AI must be able to explain every function to a teammate.
2. **Documentation requirements:** AI-generated modules must have JSDoc, README, or inline comments explaining the approach.
3. **Pair review sessions:** Schedule sessions where the developer walks through AI-generated code with a teammate.
4. **Architecture Decision Records (ADRs):** Document why AI-suggested approaches were adopted.

### Onboarding New Team Members

When new developers join, they need to know:
- How the team uses AI tools
- Where the CLAUDE.md files are and what they contain
- The PR template and review checklist for AI-generated code
- The shared prompts and skills library
- Which parts of the codebase were AI-generated

Add this to your team's onboarding documentation.

---

## Exercise

### Team AI Workflow Setup

**Goal:** Set up the infrastructure for effective team AI collaboration on a project.

**Part 1: Create a Team CLAUDE.md**

Write a CLAUDE.md file for a hypothetical team project (or your real project) that covers:
- Tech stack and architecture patterns
- Coding conventions and naming standards
- Error handling patterns
- Testing requirements
- File organization rules
- Commands for building, testing, and linting
- Explicit prohibitions (things the AI must not do)

**Part 2: Create a PR Template**

Write a PR template (as a `.github/pull_request_template.md` file) that includes:
- Standard PR sections (description, changes, testing)
- AI-specific sections (tool used, level of AI involvement, human modifications)
- Review checklist tailored for AI-generated code

**Part 3: Simulate a Review**

1. Use Claude Code or Copilot to generate a small feature (a new endpoint with a service and tests)
2. Open the generated code in your editor
3. Walk through the AI Code Review Checklist item by item
4. Document every finding, even minor ones
5. Write review comments as if you were reviewing a teammate's PR

**Part 4: Reflect**

- Was the CLAUDE.md effective at guiding AI output? What was missing?
- How long did the review take? Would it take less time with practice?
- What findings surprised you? What did the AI get right that you expected it to get wrong?
- How would you improve the CLAUDE.md based on what the AI produced?
