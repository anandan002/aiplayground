# Claude Cowork and Agent Teams

> Official docs: [Cowork](https://support.claude.com/en/articles/13345190-get-started-with-cowork) | [Agent Teams](https://code.claude.com/docs/en/agent-teams)

## Learning Objectives

By the end of this module, you will be able to:

- Explain what Claude Cowork is and how it differs from Claude Code
- Use Cowork for non-coding knowledge work: research, file management, document creation
- Configure Cowork with global instructions, folder access, and plugins
- Set up scheduled tasks for recurring automated workflows
- Enable and use Claude Code Agent Teams for multi-agent development
- Design effective team structures with the right number of teammates and task sizes
- Choose between subagents, agent teams, and manual parallel sessions
- Apply best practices for parallel AI coordination on a shared codebase

---

## Part 1: Claude Cowork

### What Is Cowork?

Cowork is Claude's agentic desktop mode. It uses the same architecture that powers Claude Code -- autonomous multi-step execution, tool use, sub-agent coordination -- but accessible through the Claude Desktop app instead of the terminal.

Where Claude Code targets developers writing and debugging code, Cowork targets **knowledge work**: research, document creation, file organization, data analysis, and recurring workflows. You describe an outcome, step away, and come back to finished work.

```
Claude Code  = Terminal-based, developer-focused, code-centric
Cowork       = Desktop-based, knowledge-worker-focused, file-and-document-centric
Both         = Same agentic engine, same reasoning capabilities
```

### How Cowork Works

When you give Cowork a task, Claude:

1. **Analyzes** your request and creates a plan
2. **Breaks** complex work into subtasks when needed
3. **Executes** work in an isolated virtual machine (VM) environment
4. **Coordinates** multiple workstreams in parallel if appropriate
5. **Delivers** finished outputs directly to your file system

The VM isolation is a key safety feature -- code runs in a sandbox separate from your OS. Claude cannot access files outside the folders you explicitly grant access to.

### Platform Requirements

| Requirement | Details |
|---|---|
| **App** | Claude Desktop (macOS or Windows) |
| **Plans** | Pro, Max, Team, or Enterprise |
| **macOS** | Apple Silicon (M1+) recommended; Intel supported |
| **Windows** | x64 only (arm64 not yet supported) |
| **Not available** | Web, mobile, or terminal (use Claude Code for terminal) |

**Important:** The Claude Desktop app must remain open while Cowork is running. Closing the app ends the session.

### Setting Up Cowork

#### 1. Grant Folder Access

Cowork can only read and write files in folders you explicitly allow. Open Claude Desktop, navigate to Settings, and add the folders you want Claude to access.

```
Example: Grant access to ~/Documents/reports/
Claude can now read, edit, and create files in that folder.
Claude CANNOT access ~/Desktop/ or any other folder unless you add it.
```

#### 2. Configure Global Instructions

Global instructions apply to every Cowork session. Use them to set your preferences:

```
Settings > Cowork > Global Instructions

Example:
"When creating documents, use professional tone with clear headings.
Always output Excel files with formatted headers and auto-filters.
When summarizing research, include source URLs."
```

#### 3. Configure Folder Instructions

Folder-specific instructions give Claude context about a particular project:

```
~/Documents/quarterly-reports/CLAUDE.md

"This folder contains quarterly financial reports.
Use the template in template.xlsx for all new reports.
Currency format: USD with 2 decimal places.
Fiscal year starts April 1."
```

Claude reads these instructions automatically when working in that folder.

### Core Capabilities

#### File Management

```
"Sort my Downloads folder. Group files by type (PDFs, images,
spreadsheets, documents). Rename each file with the date prefix
YYYY-MM-DD based on when it was last modified. Delete any duplicate files."
```

Cowork reads the folder, categorizes files, renames them, moves them into subfolders, and removes duplicates -- all autonomously.

#### Research and Analysis

```
"Read all the PDF research papers in ~/research/ai-safety/.
For each paper, extract: title, authors, key findings, methodology.
Create a summary spreadsheet comparing them, and write a 2-page
synthesis document highlighting areas of agreement and disagreement."
```

Cowork reads each PDF, extracts information, creates a structured Excel spreadsheet with formulas, and writes a formatted summary document.

#### Document Creation

Cowork can generate professional outputs:

- **Excel** with formulas, conditional formatting, VLOOKUP, and pivot tables
- **PowerPoint** presentations from notes or data
- **Word documents** with proper formatting and styles
- **PDFs** for final deliverables

```
"Read my meeting notes from this week (notes-*.md files).
Create a PowerPoint deck summarizing key decisions, action items,
and timeline. Use a clean, professional style with no more than
5 bullets per slide."
```

#### Data Work

```
"Analyze the sales data in sales-2025.csv.
Calculate monthly trends, identify top 10 products by revenue,
find any statistical outliers, and create visualizations.
Output everything to an Excel workbook with separate tabs for
each analysis."
```

### Scheduled Tasks

Scheduled tasks let you define recurring work that Cowork runs automatically.

#### Creating a Scheduled Task

Type `/schedule` in any Cowork session:

```
/schedule

"Every Monday at 8 AM, read the files in ~/reports/weekly-inputs/,
compile them into a weekly team summary using the template in
~/reports/template.docx, and save the result as
~/reports/weekly/summary-YYYY-MM-DD.docx"
```

#### Cadence Options

| Cadence | Example |
|---|---|
| Hourly | Monitor a folder for new files and process them |
| Daily | Generate a morning briefing from overnight data |
| Weekdays | Compile daily standup notes |
| Weekly | Create weekly summary reports |
| On-demand | Run only when you trigger it manually |

**Limitation:** Scheduled tasks only run while your computer is awake and the Claude Desktop app is open. If the app is closed when a task is scheduled, Cowork runs it when the app reopens.

### Plugins

Plugins bundle skills, connectors, slash commands, and sub-agents into installable packages tailored for specific roles.

Cowork ships with plugins for:

- **Productivity** -- task management, note organization, email drafting
- **Product management** -- strategy canvases, roadmap generation
- **Data analysis** -- statistical analysis, visualization
- **Marketing** -- content calendars, competitor analysis
- **Finance** -- expense reports, budget tracking
- **Legal** -- contract review, compliance checklists

#### Using Slash Commands from Plugins

Plugins add slash commands for structured workflows:

```
/strategy    -- Walk through a product strategy canvas
/schedule    -- Create recurring automated tasks
/research    -- Deep research with web search and synthesis
```

### MCP Connectors

Cowork supports MCP (Model Context Protocol) integrations for connecting to external services:

- **Google Calendar, Drive, Gmail** -- read and manage Google Workspace
- **GitHub** -- access repositories, issues, PRs
- **Slack** -- read channels and send messages
- **And more** -- DocuSign, WordPress, Salesforce connectors available

You control which MCP connectors Claude can access and how often they require permission.

### Cowork Safety and Permissions

| Control | Details |
|---|---|
| **Folder access** | Claude only sees folders you explicitly grant |
| **File deletion** | Claude requires explicit permission before permanently deleting files |
| **VM isolation** | All code execution happens in a sandbox, separate from your OS |
| **MCP permissions** | You control which services Claude can access |
| **Internet access** | Configurable per session |

**Important:** Cowork conversation history is stored locally only. It is not captured in Anthropic's audit logs, compliance API, or data exports. This means Cowork is not suitable for regulated workloads that require full auditability.

### When to Use Cowork vs. Claude Code

| Scenario | Use |
|---|---|
| Writing, debugging, or refactoring code | Claude Code |
| Multi-file code changes with git integration | Claude Code |
| Organizing files and creating documents | Cowork |
| Data analysis with Excel/PowerPoint output | Cowork |
| Recurring automated workflows (weekly reports, etc.) | Cowork |
| Agentic development with MCP servers in terminal | Claude Code |
| Research synthesis from PDFs and web sources | Cowork |
| Code review and security scanning | Claude Code |

Both tools share the same underlying AI -- the difference is the interface and the target workflow.

---

## Part 2: Claude Code Agent Teams

### What Are Agent Teams?

Agent teams let you coordinate **multiple Claude Code instances** working together on a shared codebase. One session acts as the **team lead**, coordinating work, assigning tasks, and synthesizing results. **Teammates** work independently, each in its own context window, and communicate directly with each other.

This is different from subagents:

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Own context window; results return to caller | Own context window; fully independent |
| **Communication** | Report results back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| **Token cost** | Lower (results summarized back) | Higher (each teammate is a separate Claude instance) |

**Use subagents** when you need quick, focused workers that report back.
**Use agent teams** when teammates need to share findings, challenge each other, and coordinate on their own.

### Enabling Agent Teams

Agent teams are experimental and disabled by default. Enable them by adding the flag to your `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set the environment variable in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### Starting a Team

Describe the task and team structure in natural language:

```
I'm adding a notification system to the application.
Create an agent team:
- One teammate to implement the backend service and database schema
- One teammate to build the React notification components
- One teammate to write tests for both layers

Each teammate should own separate files to avoid conflicts.
```

Claude creates the team, spawns teammates, assigns tasks, and coordinates work.

### How Teams Are Structured

| Component | Role |
|---|---|
| **Team lead** | Your main Claude Code session. Creates the team, spawns teammates, coordinates work |
| **Teammates** | Separate Claude Code instances, each working on assigned tasks |
| **Task list** | Shared list of work items that teammates claim and complete |
| **Mailbox** | Messaging system for inter-agent communication |

Teams and tasks are stored locally:

```
~/.claude/teams/{team-name}/config.json    -- Team configuration
~/.claude/tasks/{team-name}/               -- Task files
```

### Display Modes

#### In-Process Mode (Default)

All teammates run inside your main terminal. Navigate between them with keyboard shortcuts:

| Key | Action |
|---|---|
| `Shift+Down` | Cycle to next teammate |
| `Enter` | View a teammate's session |
| `Escape` | Interrupt a teammate's current turn |
| `Ctrl+T` | Toggle the shared task list |

#### Split-Pane Mode

Each teammate gets its own terminal pane. Requires `tmux` or iTerm2.

```json
// settings.json
{
  "teammateMode": "tmux"
}
```

Or per-session:

```bash
claude --teammate-mode tmux
```

Split-pane mode lets you see everyone's output at once and click into any pane to interact directly.

### Controlling the Team

#### Assigning Tasks

The lead creates tasks and assigns them. You can be explicit or let teammates self-claim:

```
# Explicit assignment
Assign the database migration task to the backend teammate.

# Self-claim
Let teammates pick up tasks as they finish their current work.
```

Tasks have three states: **pending**, **in progress**, and **completed**. Tasks can depend on other tasks -- a pending task with unresolved dependencies cannot be claimed until those dependencies are completed.

#### Talking to Teammates Directly

Each teammate is a full, independent Claude Code session. You can message any teammate directly:

```
# In in-process mode
Press Shift+Down to cycle to the teammate, then type your message.

# In split-pane mode
Click into the teammate's pane and type.
```

This is useful for giving additional instructions, asking questions, or redirecting approach.

#### Requiring Plan Approval

For complex or risky tasks, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

The teammate works in read-only plan mode until the lead approves the plan. If rejected, the teammate revises and resubmits.

#### Specifying Models

You can choose which model teammates use:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Best Use Cases for Agent Teams

#### 1. Parallel Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Each reviewer applies a different lens to the same code. The lead synthesizes findings.

#### 2. Debugging with Competing Hypotheses

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them
talk to each other to try to disprove each other's theories, like a
scientific debate. Update the findings doc with whatever consensus emerges.
```

The adversarial structure prevents anchoring bias. The theory that survives debate is more likely to be the actual root cause.

#### 3. New Module or Feature Development

```
Create an agent team to build the notifications module:
- Teammate 1: Database schema and service layer (src/services/notification.*)
- Teammate 2: API routes and middleware (src/routes/notification.*)
- Teammate 3: React components and hooks (src/components/notifications/*)
- Teammate 4: Test suites for all three layers (src/__tests__/notifications/*)

Dependencies: Teammate 4 should wait for Teammates 1-3 to finish
their implementations before writing integration tests.
```

#### 4. Cross-Layer Coordination

```
We need to rename the "workspace" concept to "project" across the
entire codebase. Create an agent team:
- Teammate 1: Database migrations and backend models
- Teammate 2: API routes and service layer
- Teammate 3: Frontend components and state management
- Teammate 4: Documentation and configuration files

Each teammate should message the others about interface changes
that affect their layer.
```

### Best Practices

#### Right-Size Your Team

Start with **3-5 teammates** for most workflows. More teammates means more token cost and coordination overhead.

```
Rule of thumb: 5-6 tasks per teammate keeps everyone productive.

15 independent tasks → 3 teammates
25 independent tasks → 5 teammates
5 tightly coupled tasks → Don't use teams. Use a single session.
```

#### Give Teammates Enough Context

Teammates load CLAUDE.md and MCP servers automatically, but they do NOT inherit the lead's conversation history. Include task-specific details in the spawn prompt:

```
Spawn a security reviewer teammate with the prompt:
"Review the authentication module at src/auth/ for security
vulnerabilities. Focus on token handling, session management,
and input validation. The app uses JWT tokens stored in httpOnly
cookies. Report any issues with severity ratings."
```

#### Avoid File Conflicts

Two teammates editing the same file leads to overwrites. **Break the work so each teammate owns a different set of files.**

```
# BAD: Both teammates might edit the same files
Teammate 1: "Implement user features"
Teammate 2: "Add validation to user features"

# GOOD: Clear file ownership
Teammate 1: "Implement user service in src/services/user.service.ts"
Teammate 2: "Implement user validation in src/validators/user.validator.ts"
```

#### Monitor and Steer

Check in on teammates' progress. Let a team run unattended for too long and you risk wasted effort:

```
What is each teammate's current status?
```

If a teammate is going in the wrong direction:

```
Tell the frontend teammate to use the existing Modal component
from src/components/ui/ instead of creating a new one.
```

#### Wait for Teammates

Sometimes the lead starts implementing tasks itself instead of waiting. If this happens:

```
Wait for your teammates to complete their tasks before proceeding.
```

### Enforcing Quality with Hooks

Use Claude Code hooks to enforce rules when teammates finish work:

- **`TeammateIdle`**: Runs when a teammate is about to go idle. Exit with code 2 to send feedback and keep the teammate working.
- **`TaskCompleted`**: Runs when a task is being marked complete. Exit with code 2 to prevent completion and send feedback.

Example: Require tests to pass before a task can be marked complete:

```json
// .claude/hooks.json
{
  "TaskCompleted": {
    "command": "npm test -- --testPathPattern=$TASK_FILES",
    "description": "Tests must pass before task completion"
  }
}
```

### Shutting Down

Shut down teammates first, then clean up the team:

```
Ask all teammates to shut down.
```

Wait for them to finish, then:

```
Clean up the team.
```

**Always use the lead to clean up.** Teammates should not run cleanup.

### Current Limitations

Agent teams are experimental. Be aware of:

| Limitation | Impact |
|---|---|
| No session resumption for teammates | `/resume` does not restore teammates -- spawn new ones |
| Task status can lag | Check manually if a task appears stuck |
| One team per session | Clean up current team before starting a new one |
| No nested teams | Teammates cannot spawn their own teams |
| Lead is fixed | Cannot transfer leadership to a teammate |
| Split panes need tmux/iTerm2 | In-process mode works in any terminal |
| Higher token usage | Each teammate is a separate Claude instance |

---

## Part 3: Choosing the Right Approach

### Decision Matrix

| Scenario | Best Approach | Why |
|---|---|---|
| Quick file search or analysis | **Subagent** | Low overhead, result returns to main session |
| Refactor one module | **Single session** | Sequential work, same files |
| Build 3 independent features | **Agent team (3 teammates)** | Parallel work, no file conflicts |
| Review a PR from multiple angles | **Agent team (3 reviewers)** | Different perspectives in parallel |
| Debug with unknown root cause | **Agent team (competing hypotheses)** | Adversarial debate finds truth faster |
| Rename a concept across the codebase | **Agent team (layer owners)** | Each layer is independent |
| Run a single test and report results | **Subagent** | Focused task, only result matters |
| Create weekly reports from data | **Cowork (scheduled)** | Non-code, recurring, desktop workflow |
| Organize files and create documents | **Cowork** | File management, document creation |
| Same-file intensive edits | **Single session** | Parallel edits on same file cause conflicts |

### Cost Considerations

```
Single session:     1x token cost (baseline)
Subagents:          ~1.2-1.5x (results summarized back)
Agent teams (3):    ~3x (three independent context windows)
Agent teams (5):    ~5x (five independent context windows)
Cowork:             Higher than chat (multi-step VM execution)
```

Agent teams are worth the cost when the parallel speedup and quality improvement outweigh the token expense. Research, review, and independent feature work are the strongest ROI scenarios.

---

## Exercise

### Part 1: Cowork -- Build a Sprint Report Generator (20 minutes)

**Goal:** Create a fully specified Cowork automation that generates a weekly sprint report from raw inputs.

**Scenario:** Every Friday, your team lead manually:
1. Opens 5-6 markdown standup files from the week (`standups/2026-03-03.md` through `standups/2026-03-07.md`)
2. Reads the Jira export CSV (`jira/sprint-export.csv`) to see which tickets moved to Done
3. Checks the `metrics/velocity.json` file for sprint velocity numbers
4. Writes a formatted report in `reports/sprint-report-YYYY-MM-DD.docx`

This takes ~45 minutes every week. Automate it with Cowork.

**Step 1: Write the folder instructions** (`~/team-data/CLAUDE.md`)

Include:
- What each subdirectory contains (`standups/`, `jira/`, `metrics/`, `reports/`)
- The report format: Executive Summary (3 bullets), Completed Work (table with ticket ID, title, assignee, story points), Blockers & Risks, Velocity Trend (compare last 4 sprints), Next Sprint Preview
- Tone: professional, concise, no jargon -- this goes to a VP

**Step 2: Write the `/schedule` prompt**

Write the exact prompt you would type after `/schedule`. It must:
- Specify the cadence (every Friday at 4 PM)
- Tell Claude which files to read and how to find the current week's standups
- Specify the output filename pattern (`sprint-report-YYYY-MM-DD.docx`)
- Handle the case where a standup file is missing (note it in the report, do not fail)
- Include a velocity trend chart in the output

**Step 3: Write the global instructions**

Write global instructions (Settings > Cowork) that apply to all sessions:
- Default document formatting preferences
- How to handle missing or malformed input files
- Never delete source files
- Always include a "Generated by Claude Cowork" footer with timestamp

**Step 4: Test it manually first**

Create 3 sample standup files, a sample CSV, and a sample velocity JSON. Give Cowork the full prompt (without scheduling) and evaluate:
- Did the report capture all completed tickets from the CSV?
- Did it correctly summarize blockers from the standups?
- Is the velocity trend accurate?
- Would your VP find this useful as-is, or does it need editing?

**Deliverable:** The three artifacts (folder instructions, schedule prompt, global instructions) plus a written evaluation of the test run output.

---

### Part 2: Cowork -- Competitive Intelligence Briefing (20 minutes)

**Goal:** Use Cowork to produce a structured competitive analysis document.

**Scenario:** Your product team wants a monthly comparison of 3 competing products. You have a folder with:
- `competitors/acme-corp/` -- screenshots, pricing page PDFs, changelog excerpts
- `competitors/beta-inc/` -- same structure
- `competitors/gamma-io/` -- same structure
- `our-product/features.md` -- your current feature list with status

**Step 1: Write the Cowork prompt**

```
Read all files in competitors/ and our-product/features.md.
For each competitor, produce:
[your detailed instructions here]
```

Your prompt must specify:
- A feature comparison matrix (rows = features, columns = us + 3 competitors, cells = "Yes", "No", "Partial", "Superior")
- A pricing comparison table
- A "Gaps & Opportunities" section identifying features competitors have that we lack
- A "Our Advantages" section identifying where we lead
- Output as an Excel workbook with 4 tabs: Feature Matrix, Pricing, Gaps, Advantages
- Each tab should have conditional formatting (green = advantage, red = gap, yellow = partial)

**Step 2: Write the folder instructions** for the `competitors/` directory

Include:
- How competitor data is organized
- How to interpret screenshots (product UI) vs PDFs (pricing) vs markdown (changelogs)
- The date format used in changelog excerpts
- How to handle missing data for a competitor (mark as "Unknown", do not guess)

**Step 3: Evaluate the output**

After running the prompt:
- Open the Excel file. Are the formulas and conditional formatting correct?
- Is the feature matrix accurate based on the source files?
- Did Claude hallucinate any competitor features not supported by the source data?
- What would you change in the prompt to get better results next time?

---

### Part 3: Agent Teams -- Parallel API + Frontend + Tests (30 minutes)

**Goal:** Design and execute an agent team workflow for building a notification system.

**Scenario:** Your Next.js application needs a notification system with:
- A `notifications` table (id, userId, type, title, message, read, createdAt)
- A service layer with: `getUnread(userId)`, `markAsRead(id)`, `markAllRead(userId)`, `create(notification)`
- REST endpoints: `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `POST /api/notifications/:id/read-all`
- A React `<NotificationBell />` component showing unread count badge, dropdown with notification list, mark-as-read on click
- Unit tests for the service, integration tests for the API, component tests for the bell

**Step 1: Design the team (written plan)**

Fill in this table:

| Teammate | Role | Files Owned | Depends On |
|---|---|---|---|
| 1 | ? | ? | ? |
| 2 | ? | ? | ? |
| 3 | ? | ? | ? |
| 4 | ? | ? | ? |

Rules:
- No two teammates should edit the same file
- Teammate 4 (tests) must wait for 1-3 to finish
- The schema teammate must finish before the API teammate starts

**Step 2: Write the exact lead prompt**

Write the natural language prompt you would give Claude Code to create the team. Include:
- Team name and teammate count
- Each teammate's specific spawn prompt with file paths, patterns to follow, and constraints
- Dependency ordering (which tasks block which)
- Plan approval requirement for the schema design
- Model selection (e.g., Sonnet for implementation teammates, Opus for the schema architect)

Example structure:
```
Create an agent team called "notifications" with 4 teammates:

Teammate 1 (Schema Architect): ...
[specific files, specific instructions, plan approval required]

Teammate 2 (API Developer): ...
[specific files, depends on Teammate 1, follow existing route patterns in src/app/api/]

...
```

**Step 3: Execute (if Agent Teams enabled) or dry-run**

If you have Agent Teams enabled, run it and document:
- Screenshot or copy the task list after the lead creates it
- How long did each teammate take?
- Did any teammate get stuck? How did you intervene?
- Were there any file conflicts or merge issues?
- What was the total token cost?

If you do not have Agent Teams enabled, trace through your plan manually:
- For each teammate, what would Claude read first? What would it create?
- Where are the coordination points (teammate needs info from another)?
- What could go wrong?

**Step 4: Compare with single-session approach**

Estimate: how long would this take in a single Claude Code session vs. with the agent team? Consider:
- Single session: sequential, no coordination overhead, but one context window
- Agent team: parallel, coordination overhead, but 3-4x parallelism

Write a 3-sentence verdict on whether agent teams were worth it for this task.

---

### Part 4: Debugging with Competing Hypotheses (15 minutes)

**Goal:** Practice the adversarial investigation pattern with agent teams.

**Scenario:** Users report that the application intermittently shows stale data after saving. The save appears to succeed (no error), but refreshing the page sometimes shows the old value. It happens ~20% of the time, more often under load.

**Step 1: List 4 hypotheses**

Before using any tools, write down 4 plausible root causes. For example:
1. Race condition between the write and the subsequent read
2. Caching layer serving stale data after the write
3. Database replication lag (if using read replicas)
4. Optimistic UI update not rolling back on partial failure

**Step 2: Write the agent team prompt**

Write a prompt that spawns 4 teammates, one per hypothesis. Each teammate must:
- Investigate ONLY their assigned hypothesis
- Read specific files relevant to their theory (name the files/directories)
- Produce a verdict: Confirmed, Likely, Unlikely, or Ruled Out -- with evidence
- Actively challenge the other teammates' findings via messages

Example:
```
Create an agent team to investigate stale data after save.
Spawn 4 teammates, each investigating one hypothesis:

Teammate 1 (Race Condition Investigator):
  Read src/services/*, src/routes/* for the save flow.
  Look for: async operations without await, missing transaction boundaries,
  read-after-write without causal consistency.
  Verdict format: [Confirmed|Likely|Unlikely|Ruled Out] + evidence.
  Challenge Teammate 2's caching theory if you find write-path issues.

Teammate 2 (Cache Investigator):
  ...
```

**Step 3: Predict the outcome**

Before running the team (or if you cannot run it), answer:
- Which hypothesis do you think is most likely? Why?
- How would each teammate challenge the others?
- What evidence would definitively rule out each hypothesis?
- If two hypotheses are both "Likely", what would the lead do next?

---

### Part 5: Decision Scenarios (10 minutes)

For each scenario, choose **subagent**, **agent team**, **single session**, or **Cowork**. Write your choice and a one-sentence justification.

1. Investigate why `npm test` fails only in CI but passes locally
2. Add input validation to 12 independent Express route handlers that each have their own file
3. Create a competitive analysis document from 5 competitor websites, with an Excel comparison matrix
4. Review a 2000-line PR for security vulnerabilities, performance issues, and missing test coverage
5. Rename the `Customer` model to `Client` across 40 files spanning database, API, and frontend layers
6. Generate a weekly executive summary every Monday from Slack channel JSON exports
7. Write unit tests for 3 independent services that currently have 0% coverage
8. Prototype 3 visually different UI approaches for a settings page, each in its own branch

---

## See Also

- [Module 3: Claude Code Essentials](/modules/03-claude-code-essentials) -- Subagents, MCP, and context management
- [Module 6: Agentic Workflows and Orchestration](/modules/06-agentic-workflows-and-orchestration) -- Orchestration patterns that agent teams build on
- [Module 7: Multi-User AI Collaboration](/modules/07-multi-user-ai-collaboration) -- Team conventions and CLAUDE.md for multi-developer setups
- [Module 17: Claude Code Project Setup](/modules/17-claude-code-project-setup) -- CLAUDE.md configuration that agent teams inherit
