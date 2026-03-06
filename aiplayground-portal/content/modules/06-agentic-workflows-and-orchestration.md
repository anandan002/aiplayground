# Agentic Workflows and Orchestration

## Learning Objectives

By the end of this module, you will be able to:

- Define agentic AI workflows and distinguish them from simple completion
- Describe the key orchestration patterns used in AI-assisted development
- Leverage Claude Code's agentic capabilities including subagents and tool use
- Create custom skills and commands for repeatable workflows
- Design orchestration strategies for complex feature implementations
- Identify when agentic workflows add value versus when they introduce unnecessary risk
- Mitigate the risks of long-running autonomous AI operations

---

## What Are Agentic AI Workflows?

An **agentic workflow** is one where the AI operates with a degree of autonomy -- executing multiple steps, making intermediate decisions, and using tools to accomplish a goal without requiring human input at every step.

### The Autonomy Spectrum

```
Level 0: Autocomplete
  You type, AI suggests the next few tokens.
  Example: Copilot tab completion

Level 1: Instruction Following
  You give a specific instruction, AI executes one action.
  Example: "Rename this variable from x to count"

Level 2: Task Completion
  You describe a task, AI executes multiple steps to complete it.
  Example: "Add input validation to this endpoint"

Level 3: Goal-Directed
  You describe a goal, AI plans the steps and executes them.
  Example: "Make the search endpoint support filtering and pagination"

Level 4: Autonomous Problem Solving
  You describe a problem, AI investigates, diagnoses, and fixes it.
  Example: "The CI is failing. Figure out why and fix it."
```

Traditional inline completion tools operate at Levels 0-1. **GitHub Copilot's Agent Mode** operates at Levels 2-3, handling multi-file edits and terminal commands within VS Code. **Claude Code** routinely operates at Levels 2-4, with advanced orchestration capabilities (subagents, MCP servers, custom skills) that enable the most complex autonomous workflows. This module focuses on how to effectively work at Levels 3-4.

### Why Agentic Matters

The productivity gain from Level 0 to Level 4 is not linear -- it is exponential:

| Level | Human Effort | AI Effort | Tasks Per Hour |
|-------|-------------|-----------|----------------|
| 0: Autocomplete | High | Low | 2-3 |
| 1: Instruction | High | Low | 3-5 |
| 2: Task | Medium | Medium | 5-10 |
| 3: Goal-directed | Low | High | 10-20 |
| 4: Autonomous | Minimal | Very High | 20+ |

The catch: higher autonomy requires higher trust, better context, and more careful review.

---

## From Simple Completion to Multi-Step Tasks

### Simple Completion (Level 0-1)

```typescript
// You type:
function calculateTax(income: number, rate: number):

// AI completes:
function calculateTax(income: number, rate: number): number {
  return income * rate;
}
```

One step. One file. Immediate result. This is the bread and butter of Copilot.

### Multi-Step Task (Level 2-3)

```
You: "Add a tax calculation module to the application"

AI executes:
  Step 1: Read existing codebase structure
  Step 2: Read related files (billing service, user model)
  Step 3: Create src/services/tax.service.ts
  Step 4: Create src/types/tax.types.ts
  Step 5: Create src/__tests__/tax.service.test.ts
  Step 6: Update src/services/billing.service.ts to use tax service
  Step 7: Run tests to verify
  Step 8: Fix any failures
```

Eight steps. Multiple files. Tool coordination. This is where agentic workflows shine.

### Autonomous Problem Solving (Level 4)

```
You: "Users are reporting that their saved preferences are sometimes
     reverting to defaults after logging out and back in"

AI investigates:
  Step 1: Read the preference storage service
  Step 2: Read the session management code
  Step 3: Read the login/logout flow
  Step 4: Grep for all places preferences are read/written
  Step 5: Trace the data flow from save to restore
  Step 6: Identify race condition: preferences saved to session,
          but session is destroyed on logout before preferences
          are persisted to database
  Step 7: Read the database persistence layer
  Step 8: Propose fix: persist preferences to database on save,
          not just on logout
  Step 9: Implement the fix across multiple files
  Step 10: Add regression test
  Step 11: Run full test suite
```

Eleven steps. Investigation, diagnosis, implementation, and verification. This is the full agentic experience.

---

## Orchestration Patterns

Orchestration is how you structure complex AI workflows for reliability and quality.

### Pattern 1: Plan-Execute-Verify

The most fundamental pattern. The AI plans before acting and verifies after executing.

```
PLAN Phase:
  > Before making any changes, analyze the codebase and create a plan
    for implementing the webhook feature. List all files that need to
    be created or modified, and the order of operations.

EXECUTE Phase:
  > Execute the plan, starting with step 1. After each step, confirm
    what was done before moving to the next.

VERIFY Phase:
  > Run the type checker, linter, and test suite. Show me the results.
    Fix any failures.
```

**When to use:** Any task that touches more than 3 files or involves non-trivial logic.

### Pattern 2: Divide and Conquer

Break a large task into independent sub-tasks that can be completed individually.

```
> I need to add internationalization (i18n) to the application.
  Let us break this into independent phases:
>
> Phase 1: Set up the i18n framework (install, configure, test basic usage)
> Phase 2: Extract all user-facing strings from the React components
> Phase 3: Create translation files for English and Spanish
> Phase 4: Add language switching to the UI
>
> Complete Phase 1 first. Do not start Phase 2 until I confirm Phase 1 is working.
```

**When to use:** Large features that can be logically decomposed. Each phase should be independently testable.

### Pattern 3: Multi-Agent Delegation

Use subagents (parallel AI workers) for tasks that can be parallelized.

```
> Analyze the entire src/ directory for potential performance issues.
  Use subagents to analyze different directories in parallel:
> - src/routes/ -- look for missing async handling and N+1 queries
> - src/services/ -- look for unoptimized database queries
> - src/middleware/ -- look for blocking operations
> - src/utils/ -- look for inefficient algorithms
>
> Aggregate the findings and prioritize by impact.
```

**When to use:** Analysis tasks across large codebases where different sections can be reviewed independently.

### Pattern 4: Generate-Test-Refine Loop

An iterative pattern where the AI generates code, tests it, and refines based on results.

```
> Implement the payment processing service.
>
> Workflow:
> 1. Generate the initial implementation
> 2. Write comprehensive tests
> 3. Run the tests
> 4. If tests fail, fix the implementation and re-run
> 5. Once all tests pass, review for code quality and refactor
> 6. Run tests again to ensure refactoring did not break anything
> 7. Show me the final implementation
```

**When to use:** Complex business logic where correctness is critical.

### Pattern 5: Scaffold-Then-Fill

The AI creates the structure first, then fills in the details.

```
> Phase 1 - Scaffold:
> Create the file structure for a new "notifications" module:
> - Types and interfaces
> - Service class (with method stubs)
> - Route handlers (with TODO placeholders)
> - Test files (with describe blocks, no test bodies)
>
> Phase 2 - Review:
> Let me review the structure before you fill in the implementations.
>
> Phase 3 - Implement:
> Now fill in the implementations, starting with the service layer.
```

**When to use:** New modules or features where you want to review the architecture before investing in implementation details.

---

## Agentic Capabilities: Copilot Agent Mode vs. Claude Code

Both GitHub Copilot and Claude Code now offer agentic workflows, but they differ in depth and orchestration power.

**Copilot Agent Mode** provides solid agentic capabilities within VS Code: multi-file editing, terminal command execution, and iterative fix-and-retry loops. It is well-suited for medium-complexity tasks where you want to stay in the IDE.

**Claude Code** offers more advanced orchestration for the highest-complexity tasks: subagents for parallel execution, MCP server integration for connecting to external tools and services, custom skills and commands, and a 200K token context window for deep codebase understanding. It is the tool of choice for complex multi-file operations, architecture-level reasoning, and workflows that require coordination across many systems.

The following sections focus on Claude Code's advanced capabilities, as they represent the current state of the art for agentic orchestration.

### Subagents

Claude Code can spawn subagents -- independent AI workers that operate in parallel on focused tasks.

```
> Use subagents to analyze these three files in parallel:
> 1. src/auth/oauth.ts -- check for security vulnerabilities
> 2. src/api/graphql.ts -- check for N+1 query issues
> 3. src/workers/email.ts -- check for error handling gaps
>
> Combine the results into a single report.
```

Subagents are useful for:
- Parallel code analysis
- Searching large codebases
- Independent subtasks that do not depend on each other

### Tool Use Chains

Claude Code chains tools together to accomplish complex tasks:

```
Glob (find files) -> Grep (search for patterns) -> Read (understand context)
-> Edit (make changes) -> Bash (run tests) -> Edit (fix failures)
```

This chain happens automatically when you give a goal-oriented instruction. Understanding the chain helps you predict behavior and provide better instructions.

### Background Tasks

For long-running operations, Claude Code can execute background tasks:

```
> Run the full E2E test suite in the background.
  While it runs, let us review the authentication changes.
```

### Conversation Context Management

Long agentic sessions consume context window space. Claude Code provides tools to manage this:

```
/compact    -- Summarize the conversation to free up context
/clear      -- Start fresh (use sparingly, you lose all context)
/cost       -- Check how much context you have used
```

**Best practice for long sessions:**
1. Complete a logical unit of work
2. Use `/compact` to summarize
3. Start the next unit with a fresh, focused prompt
4. Reference previous work explicitly rather than relying on full conversation history

---

## Custom Skills and Commands

### CLAUDE.md Customization

Your CLAUDE.md file is the primary mechanism for customizing Claude Code's behavior. For agentic workflows, include:

```markdown
# Development Workflow

## Before Making Changes
1. Read the relevant files to understand existing patterns
2. Present a plan before implementing
3. Get explicit approval before modifying more than 3 files

## After Making Changes
1. Run TypeScript type checking: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run relevant tests: `npm test -- --testPathPattern=<related-test>`
4. If any check fails, fix the issue before presenting results

## Code Standards
- All new functions must have JSDoc comments
- All new endpoints must have corresponding test files
- Database queries must use the repository pattern
- Error handling must use AppError class
```

This turns Claude Code into an agent that follows your team's specific workflow.

### Custom Commands

Create reusable commands in `.claude/commands/`:

```markdown
<!-- .claude/commands/feature.md -->
Implement a new feature following this workflow:

1. Read $ARGUMENTS to understand the requirement
2. Analyze the current codebase for related patterns
3. Present a plan with:
   - Files to create
   - Files to modify
   - New dependencies (if any)
   - Test strategy
4. Wait for approval
5. Implement the feature
6. Write tests
7. Run all checks (typecheck, lint, test)
8. Present a summary of changes
```

Usage:
```
> /feature "Add user profile picture upload with S3 storage"
```

### Workflow Skill Example

```markdown
<!-- .claude/skills/debug-endpoint.md -->
Debug a failing API endpoint:

1. Read the route handler file
2. Read the service file it calls
3. Read the test file (if it exists)
4. Check for recent changes: `git log --oneline -10 <file>`
5. Identify the most likely cause
6. Present Root Cause Analysis:
   - Symptom
   - Root cause
   - Evidence
   - Proposed fix
   - Risk assessment
7. Wait for approval before making changes
```

---

## The Orchestrator Pattern

For complex tasks, use an **orchestrator** approach: one high-level conversation that delegates to focused sub-tasks.

### Orchestrator Design

```
Orchestrator (you + Claude Code in main session)
  |
  |-- Sub-task 1: Analysis (Claude Code reads and analyzes)
  |     Output: Analysis report with recommendations
  |
  |-- Sub-task 2: Design (Claude Code proposes architecture)
  |     Output: File structure and interface definitions
  |
  |-- Sub-task 3: Implementation (Claude Code creates/edits files)
  |     Output: Working code changes
  |
  |-- Sub-task 4: Testing (Claude Code writes and runs tests)
  |     Output: Test results and coverage report
  |
  |-- Sub-task 5: Verification (Claude Code runs full validation)
  |     Output: Final quality report
```

### Implementing the Orchestrator

```
Session 1 (Planning):
> Analyze the requirements for adding real-time collaboration
  to the document editor. Read the current architecture in src/
  and propose a design with WebSocket integration.

[Review design, approve or modify]

Session 2 (Core Implementation):
> Implement the WebSocket server and connection management
  as described in the approved design.

[Review implementation]

Session 3 (Feature Integration):
> Integrate the WebSocket layer with the document editing
  service. Implement conflict resolution using operational
  transforms.

[Review integration]

Session 4 (Testing and Polish):
> Write comprehensive tests for the collaboration features.
  Run the full test suite and fix any issues.
  Review the code for quality and consistency.
```

---

## When to Go Agentic vs. Manual

### Go Agentic When

| Condition | Example |
|-----------|---------|
| Task spans 5+ files | Renaming a concept across the codebase |
| Task requires investigation | Debugging a production issue |
| Task is well-defined but tedious | Adding logging to all service methods |
| Task follows a repeatable pattern | Generating CRUD endpoints for a new model |
| Task benefits from broad context | Architecture review of the full project |

### Stay Manual When

| Condition | Example |
|-----------|---------|
| Task is in a single file, < 20 lines | Adding a helper function |
| Task requires creative design | Designing a novel UI interaction |
| Task requires domain expertise the AI lacks | Industry-specific business rules |
| Task is exploratory / experimental | Prototyping with a new library |
| The cost of getting it wrong is very high | Payment processing logic |

### The Complexity Threshold

A useful heuristic: **if the task would take you more than 15 minutes to do manually, consider an agentic approach.** Below 15 minutes, the overhead of describing the task, reviewing AI output, and iterating likely exceeds the time saved.

---

## Risks and Mitigations

### Risk 1: Hallucination in Long Chains

The longer an agentic chain runs, the higher the chance of compounding errors. A small mistake in Step 3 might cascade into larger problems by Step 10.

**Mitigation:**
- Break long chains into verified segments
- Check intermediate results before continuing
- Use `Plan-Execute-Verify` at each segment boundary

### Risk 2: Scope Creep

AI agents can "helpfully" modify things you did not ask them to modify.

**Mitigation:**
- Be explicit about scope: "Only modify files in src/auth/"
- Review all file changes before approving
- Use git to track exactly what changed: `git diff`

### Risk 3: Losing Control

A fully autonomous AI agent making dozens of changes can be hard to follow.

**Mitigation:**
- Require the AI to present plans before executing
- Set approval gates at key milestones
- Use `/compact` to keep a summary of what happened
- Always have a git checkpoint to revert to

### Risk 4: Context Window Exhaustion

Long agentic sessions can exhaust the context window, causing the AI to "forget" earlier instructions or context.

**Mitigation:**
- Use `/compact` proactively (before you hit limits)
- Break work into multiple sessions
- Keep CLAUDE.md as persistent context that survives session boundaries
- Summarize completed work at the start of each new session

### Risk 5: Over-Automation

Automating everything is not always the goal. Sometimes the human judgment at each step is the valuable part.

**Mitigation:**
- Automate the tedious parts, keep human judgment for decisions
- Use the AI for research and analysis, make decisions yourself
- Do not automate tasks you do not understand well enough to review

---

## Exercise

### Design an Orchestration Workflow

**Goal:** Design and execute a multi-phase agentic workflow for implementing a complete feature.

**Feature:** Add an audit logging system to an existing application.

**Requirements:**
- Log all API requests with: timestamp, user ID, endpoint, method, status code, response time
- Log all data mutations with: before/after values, user who made the change
- Store audit logs in a separate database table
- Provide an admin endpoint to query audit logs with filtering
- Audit logs must not impact API response times (async logging)
- Retention policy: 90 days, then archive to cold storage

**Your Task:**

**Part 1: Design the Orchestration Plan (written, no code)**

Create a phased plan with:
1. List each phase (aim for 4-6 phases)
2. For each phase, specify:
   - Inputs (what does this phase need?)
   - Actions (what does the AI do?)
   - Outputs (what is produced?)
   - Verification (how do you know it worked?)
   - Approval gate (what do you review before proceeding?)

**Part 2: Write the Prompts**

For each phase, write the exact prompt you would give to Claude Code.
Apply the techniques from Module 05 (CICE framework, step-by-step instructions).

**Part 3: Execute Phase 1**

Using Claude Code, execute only Phase 1 of your plan.
- Did the AI follow your plan?
- Did you need to course-correct? How?
- How would you modify the prompts for Phase 2 based on what you learned?

**Part 4: Reflect**

Answer these questions:
1. What was the hardest part of designing the orchestration plan?
2. Where did you choose human judgment over AI autonomy? Why?
3. If this feature needed to be built in a week, would you use an agentic approach or manual development? What is the break-even point?
4. How would you adapt this plan for a team where multiple developers need to work on different phases?
