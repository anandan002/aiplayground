# AI-Enabled Development Lifecycle

> A practical operational framework for human-AI collaborative software development. Defines the phases, quality gates, and protocols that keep AI-assisted work reliable, maintainable, and high-quality.

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [The Development Lifecycle](#2-the-development-lifecycle)
3. [Phase Details](#3-phase-details)
4. [Separating AI from Deterministic Work](#4-separating-ai-from-deterministic-work)
5. [Quality Gates](#5-quality-gates)
6. [Operational Protocols](#6-operational-protocols)
7. [Plan Validation](#7-plan-validation)
8. [Memory and Learning](#8-memory-and-learning)
9. [Failure Recovery](#9-failure-recovery)
10. [Quick Reference](#10-quick-reference)

---

## 1. Philosophy

### The Core Problem

LLMs are probabilistic. Business logic is deterministic. When AI tries to do everything itself, errors compound fast -- 90% accuracy per step is ~59% accuracy over 5 steps.

### The Solution: Separation of Concerns

| Responsibility | Owner | Why |
|---|---|---|
| **Reasoning and judgment** | AI assistant | Creativity, analysis, natural language understanding |
| **Reliable execution** | Scripts, tools, CI/CD | Repeatability, speed, deterministic outcomes |
| **Quality enforcement** | Human reviewer | Trust but verify -- AI proposes, humans approve |
| **Domain knowledge** | Documentation, context files | Shapes AI reasoning without re-explaining every session |
| **Process definition** | Team conventions | What to achieve and how, documented in project files |

### The Guiding Principle

> Every line of code should be clear, maintainable, and correct. The first solution that works is rarely good enough -- refine until it is right.

**Priority Hierarchy**: Correctness > Maintainability > Simplicity > Performance > Speed of delivery

---

## 2. The Development Lifecycle

### The 7-Phase Cycle

```
Phase 1    Phase 2    Phase 3    Phase 4    Phase 5    Phase 6    Phase 7
ANALYZE    DESIGN     VALIDATE   IMPLEMENT  TEST       ITERATE    COMMIT
  |          |          |          |          |          |          |
  v          v          v          v          v          v          v
Understand  Architect  Check the  Craft      Verify     Refine     Version
the problem the        plan for   the        quality    until      and
deeply      solution   gaps       solution   gates      great      document
  |          |          |          |          |          |          |
  v          v          v          v          v          v          v
[GATE]     [GATE]     [GATE]    [GATE]     [GATE]    [GATE]     [GATE]
Approve    Approve    Approve   Review     All pass   Approve    Approve
analysis   design     plan      code       tests      release    commit

<------------ LEARNING LOOP ------------------------------------>
Every failure strengthens the process. Update docs, fix tools.
```

### Phase Summary

| Phase | Action | AI Role | Human Role | Gate |
|-------|--------|---------|------------|------|
| 1. Analyze | Understand problem deeply | Read, investigate, gather evidence | Confirm problem statement | Approve analysis |
| 2. Design | Architect the solution | Present module design, interfaces | Review architecture | Approve design |
| 3. Validate | Check plan for completeness | Run structural + semantic checks | Review the plan | Approve plan |
| 4. Implement | Build the solution | Write code, follow existing patterns | Monitor progress | Review implementation |
| 5. Test | Verify quality gates | Run tests, capture evidence | Review results | All gates pass |
| 6. Iterate | Refine until right | Compare, measure, improve | Judge "good enough" | Approve release |
| 7. Commit | Version and document | Prepare commit, update docs | Final review | Approve commit |

### When to Use the Full Lifecycle

Not every task needs all 7 phases:

| Task Type | Phases to Use |
|-----------|--------------|
| Simple bug fix (clear root cause) | 1 (brief) → 4 → 5 → 7 |
| Medium feature (well-understood) | 1 → 2 → 4 → 5 → 7 |
| Complex feature (architectural decisions) | All 7 phases |
| Large refactor (many files, high risk) | All 7 phases |
| Documentation-only change | 4 → 7 |
| Dependency update | 1 (risk assessment) → 4 → 5 → 7 |

---

## 3. Phase Details

### Phase 1: Analyze

**Objective**: Understand the problem so deeply that the solution becomes obvious.

**For Bug Fixes (Root Cause Analysis)**:
```
Root Cause Analysis
+-- Problem: [What is actually happening -- be specific]
+-- Symptoms: [What the user reported/observed]
+-- Root Cause: [WHY this is happening -- dig deep]
+-- Evidence: [Code snippets, logs, traces that prove it]
+-- Proposed Fix
|   +-- Files to Change: [file:line -- what change]
|   +-- Why This Fixes It: [How this addresses ROOT cause]
|   +-- Risk Assessment
|       +-- Could break: [what might fail]
|       +-- Side effects: [ripple effects]
|       +-- Test coverage: [is this tested?]
+-- Approval: Proceed? (yes/no/discuss)
```

**For New Features (Discovery)**:
```
Feature Analysis
+-- What: [Single sentence description]
+-- Why: [Business/user need]
+-- Who: [Who uses this]
+-- Where: [Which modules/layers are affected]
+-- Existing Patterns: [How similar things work in the codebase]
+-- Dependencies: [What this needs, what depends on it]
+-- Risks: [What could go wrong]
```

**What AI should do in this phase**:
- Read relevant source files to understand current behavior
- Search for existing patterns that apply
- Check project documentation (CLAUDE.md, README, architecture docs)
- Present findings with evidence, not assumptions

**Gate**: Human approves the analysis before proceeding.

---

### Phase 2: Design

**Objective**: Create an architecture so clear that anyone could understand it.

**For Every New Module or Component**:
```
Module Design: [name]

Purpose: [single sentence]
Inputs: [what it receives]
Outputs: [what it produces]
Dependencies: [what it needs]
Used By: [who calls it]

Interface Contract:
  [function signatures, types, error handling]

Approve this design? (yes/no)
```

**Design Principles**:
- **Single Responsibility** -- each function does ONE thing
- **Clear naming** -- code reads like prose
- **Error handling** -- graceful failures, meaningful messages
- **Type safety** -- full typing, no `any` unless justified
- **Loose coupling** -- minimize dependencies between components

**Gate**: Human approves the design before any code is written.

---

### Phase 3: Validate

**Objective**: Ensure the plan is complete before implementation begins. Catch gaps early when they are cheap to fix.

**Gap Analysis Checklist**:

Review the plan against these categories. Flag any that are unaddressed:

| Category | Questions to Ask |
|----------|-----------------|
| **Data persistence** | Are schema changes defined? Migration strategy? Rollback plan? |
| **Configuration** | New env vars? New config files? Defaults documented? |
| **Error handling** | What happens when things fail? Recovery paths defined? |
| **Authentication/Authorization** | Who can access this? Permission checks in place? |
| **Input validation** | What inputs are accepted? What is rejected? |
| **Logging and observability** | How will you know if this works in production? |
| **Performance** | Any N+1 queries? Large data sets? Pagination needed? |
| **Caching** | Is caching needed? Invalidation strategy? |
| **Dependencies** | New libraries? License compatibility? Security implications? |
| **Testing strategy** | Unit tests? Integration tests? What edge cases matter? |
| **Documentation** | API docs? User-facing docs? Architecture decision recorded? |
| **Backwards compatibility** | Does this break existing clients or APIs? Migration path? |

**Scoring your plan**:

A plan is ready for implementation when:
- All HIGH-severity gaps are addressed (data, auth, error handling)
- MEDIUM-severity gaps have a stated approach (logging, performance, caching)
- LOW-severity gaps are acknowledged (nice-to-haves deferred intentionally)

Aim for 95%+ coverage of relevant categories before writing code. The 5 minutes spent finding a gap now saves hours of rework later.

**Task Design Best Practices**:

When breaking work into tasks, each task should clearly define:
- **Input**: What artifacts or context does this task need from previous work?
- **Output**: What does this task produce for the next task?
- **Actions**: What specifically needs to be done? (Atomic, completable in one session)
- **Verification**: How do you know this task is done correctly?
- **Handoff notes**: What does the next person (or AI session) need to know?

This is especially important for AI-assisted work where context can be lost between sessions.

**Gate**: Human approves the validated plan before implementation begins.

---

### Phase 4: Implement

**Objective**: Build the solution with craftsmanship -- not just working code, but code you are proud of.

**Implementation Workflow**:
```
1. Read existing code thoroughly (always read before writing)
2. Check project docs for conventions (CLAUDE.md, style guides)
3. Search for existing utilities before creating new ones
4. Write code following the design from Phase 2
5. Run lint/typecheck continuously as you work
6. Write tests alongside code (TDD when possible)
7. Keep changes focused -- only modify what the plan specifies
```

**Standards**:
- Every function name should be self-documenting
- Every abstraction should feel natural, not forced
- Every edge case should be handled gracefully
- Follow existing patterns in the codebase -- consistency over personal preference

**Anti-Patterns to Avoid**:
- Writing code without reading existing patterns first
- Over-engineering (adding features nobody asked for)
- Suppressing errors silently
- Using `any` types without justification
- Creating duplicate utilities that already exist in the codebase
- Making changes outside the scope of the plan

**Gate**: Human reviews the implementation before testing.

---

### Phase 5: Test

**Objective**: Prove it works with evidence, not assumptions.

**Testing Pyramid**:
```
         +----------+
         |   E2E    |  Few, critical paths only
         |  Tests   |
        ++---------++
        |Integration |  Module interactions
        |  Tests     |
       ++------------++
       |  Unit Tests   |  Every function, every edge case
       +---------------+
```

**Quality Gates (All Must Pass)**:

| # | Gate | What It Checks | Failure Action |
|---|------|----------------|----------------|
| 1 | Syntax | No parse errors | Fix immediately |
| 2 | Types | Full type safety | Fix before proceeding |
| 3 | Lint | Code quality standards | Fix or justify exception |
| 4 | Security | No OWASP top 10 violations | Block until resolved |
| 5 | Unit tests | Functions work correctly in isolation | Fix code or update test |
| 6 | Integration | Modules work together correctly | Investigate interaction |
| 7 | Performance | Within budget (API <200ms, UI <3s on 3G) | Profile and optimize |
| 8 | Documentation | Public APIs documented | Document before merge |

**Evidence to Collect**:
- Test results with pass/fail counts
- Coverage reports for changed code
- Performance measurements for affected endpoints
- Screenshots for UI changes

**Gate**: All quality gates pass before proceeding.

---

### Phase 6: Iterate

**Objective**: Refine until it is not just working, but right.

**Iteration Protocol**:
```
1. Review against original requirements
2. Compare with design from Phase 2
3. Measure against quality budgets
4. Identify rough edges
5. Simplify -- remove complexity without losing power
6. Re-run tests after each refinement
7. Get human judgment: "good enough" or "keep going"
```

**Simplification Checklist**:
- [ ] Can any abstraction be removed without losing functionality?
- [ ] Are there duplicate patterns that should be consolidated?
- [ ] Does the naming tell the story clearly?
- [ ] Would a new developer understand this in 5 minutes?
- [ ] Is every line earning its place?

**Gate**: Human approves the final state for release.

---

### Phase 7: Commit

**Objective**: Create version control history that tells a meaningful story.

**Commit Protocol**:
```
1. Review all changes (git diff)
2. Stage specific files (never git add -A blindly)
3. Write commit message that explains WHY, not just WHAT
4. Get explicit approval before committing
5. Update project docs if significant decisions were made
```

**Commit Message Format**:
```
<type>: <concise description of WHY>

<body: what changed and why it matters>

Co-Authored-By: <AI tool used> <email>
```

**Gate**: Human approves the commit before it is created.

---

## 4. Separating AI from Deterministic Work

The most critical design decision in AI-assisted development is knowing what AI should reason about versus what tools should execute deterministically.

### The Boundary

```
PROBABILISTIC (AI)                    DETERMINISTIC (Tools & Scripts)

- Reasoning about code                - Parsing and AST analysis
- Architecture decisions               - Database migrations
- Code review and analysis             - Test execution
- Natural language understanding       - Linting and formatting
- Judgment calls                       - File operations
- Creative solutions                   - API calls
- Error diagnosis                      - Build pipelines
- User interaction                     - Data transformations

FLEXIBILITY matters                    RELIABILITY matters
Approximate is OK                      Exact is required
```

### The Bridge: Human Approval Gates

```
AI proposes  -->  Human reviews  -->  Tools execute
  (draft)          (approve)           (reliable)
```

This pattern keeps AI in the "reasoning" lane and tools in the "execution" lane, with humans as the quality bridge between them.

### Practical Examples

| Task | AI Does | Tools/Scripts Do | Human Does |
|------|---------|-----------------|------------|
| Add a feature | Design the approach, write the code | Run tests, lint, type-check | Review design and code |
| Fix a bug | Analyze root cause, propose fix | Run regression tests | Approve the diagnosis |
| Refactor code | Identify patterns, suggest improvements | Run before/after benchmarks | Decide what to refactor |
| Write tests | Generate test cases and assertions | Execute tests, measure coverage | Verify tests are meaningful |
| Update deps | Assess compatibility, suggest changes | Run security scans, build checks | Approve version bumps |

---

## 5. Quality Gates

### Approval Gates (Non-Negotiable)

These are human checkpoints. AI proposes, human approves:

| Gate | When | What is Presented | Required Response |
|------|------|-------------------|-------------------|
| Analysis | After Phase 1 | Problem statement + RCA (bugs) or Feature Analysis (new) | "yes" to proceed |
| Design | After Phase 2 | Module design + interface contracts | "yes" to proceed |
| Plan | After Phase 3 | Validated plan with gap analysis | "yes" to proceed |
| Implementation | After Phase 4 | Working code + evidence | "yes" to proceed |
| Release | After Phase 6 | Final refined state | "yes" to release |
| Commit | Phase 7 | Diff + commit message | "yes" to commit |

### When to Skip Gates

Gates can be skipped ONLY when the human explicitly says:
- "Just do it" or "skip the analysis"
- Simple, low-risk changes the human explicitly requested
- Documentation-only changes
- The human has already approved the approach in the current session

### Why Gates Matter

Without gates, AI-assisted development degrades into "AI writes, human rubber-stamps." The gates force:
- **Shared understanding** -- human and AI agree on the problem before solving it
- **Intentional design** -- architecture is deliberate, not accidental
- **Caught gaps** -- plan validation finds missing pieces before code is written
- **Code ownership** -- the human who approves owns the result

---

## 6. Operational Protocols

### Protocol 1: Before Starting Any Task

```
1. Read project documentation (CLAUDE.md, README, architecture docs)
2. Understand existing patterns in the codebase
3. Check if similar work has been done before
4. Understand the current state of the branch and any in-flight work
5. THEN begin Phase 1 (Analyze)
```

### Protocol 2: When Something Fails

```
1. Read the error and stack trace carefully
2. Identify root cause (not symptoms)
3. Fix the underlying issue
4. Add a test that would have caught it
5. Document the lesson if it is a recurring pattern
6. Next time -> automatic prevention
```

### Protocol 3: When Stuck

```
1. Explain clearly what is blocking you
2. Explain what you need to proceed
3. Do NOT guess or make up information
4. Do NOT retry the same failed approach repeatedly
5. Consider alternative approaches
6. Ask the human for guidance
```

### Protocol 4: Context Preservation

```
Important decision made        -> Document in project docs
Session ending                 -> Note any in-progress state
Architecture choice            -> Record in architecture docs or ADRs
Learned a constraint           -> Update project conventions
Found a recurring bug pattern  -> Add to test suite or CI gate
```

---

## 7. Plan Validation

### Why Validate Plans Before Implementation

The cheapest time to find a gap is before you write code. A missing database migration discovered during code review costs 10x more than one caught during planning.

### The Validation Process

```
Step 1: STRUCTURAL CHECK
  - Are all required components listed?
  - Are dependencies between tasks defined?
  - Is each task specific enough to act on?

Step 2: GAP ANALYSIS
  - Walk through the gap categories from Phase 3
  - Assign severity: HIGH (blocks release) / MEDIUM (should address) / LOW (nice-to-have)
  - Flag any HIGH gaps that are unaddressed

Step 3: FILL THE GAPS
  - Add tasks for each HIGH gap
  - Update dependencies between tasks
  - Re-estimate if scope changed significantly

Step 4: READINESS CHECK
  - Are all HIGH gaps addressed?
  - Does the plan cover the happy path AND error paths?
  - Can each task be completed and verified independently?
  - If yes -> present for approval
  - If no -> repeat from Step 2
```

### Common Gaps Teams Miss

| Gap | How It Surfaces | Prevention |
|-----|----------------|------------|
| No rollback plan | Feature breaks production, no way to undo | Always define rollback in the plan |
| Missing error handling | Users see stack traces instead of error messages | Check every external call for failure handling |
| No migration strategy | Database changes break existing data | Plan data migration alongside schema changes |
| Missing auth checks | Endpoint is publicly accessible | Review every new endpoint for auth requirements |
| No logging | Cannot debug production issues | Add structured logging for new features |
| Forgotten edge cases | Null inputs, empty lists, concurrent access | Walk through edge cases during plan review |

---

## 8. Memory and Learning

### The Continuous Improvement Loop

```
Every failure strengthens the process:

  1. Identify what broke and why
  2. Fix the immediate issue
  3. Add a test or CI gate that would have caught it
  4. Document the lesson in project conventions
  5. Next time -> automatic prevention

This is NOT optional. Every failure that is not documented is a failure repeated.
```

### Where Knowledge Lives

| Layer | What It Contains | Persistence |
|-------|-----------------|-------------|
| **Project docs** (CLAUDE.md, README) | Architecture, conventions, gotchas | Permanent -- always loaded |
| **Architecture Decision Records** | Why past decisions were made | Permanent -- referenced when revisiting decisions |
| **Test suite** | Encoded behavior expectations | Permanent -- enforced on every change |
| **CI/CD configuration** | Quality gates and automation | Permanent -- enforced on every PR |
| **Git history** | What changed, when, why | Immutable -- the authoritative record |
| **Session context** | Current task, in-progress decisions | Ephemeral -- relevant to current session only |

### What to Persist vs Discard

| Persist (Long-Term Value) | Discard (Ephemeral) |
|---|---|
| Architecture decisions and WHY | Raw debug output |
| API constraints discovered | Intermediate scratch work |
| Patterns that work in this codebase | Failed experiment details (keep summary only) |
| Gotchas and edge cases | Temporary file contents |
| User/team preferences | Session-specific state after completion |
| Tool/CI improvements | Verbose logs |

---

## 9. Failure Recovery

### Error Classification

| Type | Example | Recovery |
|------|---------|----------|
| Syntax | Parse error, missing import | Fix immediately, re-run |
| Runtime | Null reference, type mismatch | Root cause analysis, fix root cause |
| Logic | Wrong algorithm, bad conditional | Trace data flow, fix logic |
| Integration | API change, dependency issue | Check compatibility, update |
| Performance | Timeout, memory issue | Profile, optimize critical path |
| Process | Wrong approach, missing context | Go back to Phase 1 (Analyze) |

### Blast Radius Assessment

Before fixing anything, assess impact:

```
1. What other features could be affected by this change?
2. Are there shared utilities involved?
3. What is the dependency chain?
4. Could the fix introduce new issues?
5. Is this a symptom or the root cause?
```

### Change Size Classification

| Size | Scope | Approach |
|------|-------|----------|
| Small | <10 lines, single function | Fix directly, run affected tests |
| Medium | Multiple functions, <50 lines | Create a branch, run full test suite |
| Large | Multiple files, >50 lines | Full lifecycle (Phases 1-3 before coding) |

---

## 10. Quick Reference

### The Lifecycle in One Sentence

> Analyze deeply, design clearly, validate thoroughly, implement carefully, test rigorously, iterate until right, commit intentionally -- and learn from everything.

### Do

- Read existing code before writing new code (always)
- Search the codebase before creating new utilities
- Present analysis before fixing bugs
- Get approval before implementing designs
- Run tests after every change
- Document decisions that future developers will need
- Simplify when possible

### Don't

- Write code without understanding existing patterns
- Skip approval gates
- Auto-commit without permission
- Guess when you can verify
- Retry failed approaches without changing strategy
- Add features nobody asked for
- Suppress errors silently

### Decision: Which Phases Do I Need?

```
Is this a trivial fix (typo, formatting)?
  YES -> Phase 4 (implement) + Phase 7 (commit)
  NO  |
      v
Is the root cause clear and the fix obvious?
  YES -> Phase 1 (brief analysis) + Phase 4 + Phase 5 + Phase 7
  NO  |
      v
Does this require design decisions?
  YES -> Phase 1 + Phase 2 + Phase 4 + Phase 5 + Phase 7
  NO  |
      v
Is this high-risk (many files, architectural, data migrations)?
  YES -> All 7 phases (full lifecycle)
```

### Your Job in One Sentence

AI assists with reasoning and code generation; tools handle deterministic execution; humans make judgment calls and approve results. The lifecycle ensures nothing falls through the cracks.

---

## See Also

- [Module 11: AI-Assisted Dev Best Practices](/modules/ai-dev-best-practices) -- Team-level policies, CI/CD gates, and governance that complement this lifecycle.
- [Module 14: AI + Manual Hybrid Workflow](/modules/ai-hybrid-workflow) -- Daily sprint-level workflow patterns that implement these lifecycle phases.
- [Module 16: HTC AI-Assisted Development POV](/modules/htc-ai-dev-pov) -- Strategic overview of the AI-enabled development vision.

---

*This framework is a starting point, not a rigid process. Adapt it to your team's needs, and update it as you learn what works.*

*Last updated: 2026-03-07*
