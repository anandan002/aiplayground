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

### Part 1: Cowork -- Automate a Recurring Workflow (15 minutes)

**Goal:** Design a scheduled Cowork task for your team's workflow.

1. Identify a recurring task your team does manually (weekly report, data compilation, file organization, meeting notes synthesis).

2. Write the Cowork prompt that would automate it:
   - What folders does Claude need access to?
   - What is the input (files, data sources)?
   - What is the output (document type, format, location)?
   - What cadence should it run on?

3. Write the global and folder instructions that would ensure consistent quality across runs.

**Deliverable:** A written Cowork automation spec including: folder permissions, global instructions, folder instructions, the `/schedule` prompt, and expected output.

### Part 2: Agent Teams -- Parallel Feature Development (30 minutes)

**Goal:** Design and execute an agent team workflow for a multi-component feature.

**Scenario:** Your team needs to add a "user activity feed" to the application. The feature requires:
- A database schema and service layer for storing activity events
- An API endpoint for querying activity with pagination and filtering
- A React component that displays the feed with infinite scroll
- Tests for the service, API, and component

**Task:**

1. **Design the team structure** (written plan):
   - How many teammates?
   - What does each teammate own (specific files)?
   - What are the task dependencies?
   - What model should each teammate use?
   - What quality gates should you enforce?

2. **Write the lead prompt** that creates the team and assigns work. Apply the best practices from this module:
   - Clear file ownership per teammate
   - Enough context in each teammate's spawn prompt
   - Explicit dependency ordering
   - Plan approval for the architecture teammate

3. **If you have Agent Teams enabled**, execute the plan:
   - How did the lead distribute work?
   - Did teammates communicate effectively?
   - Were there any file conflicts?
   - How did you steer teammates during execution?

### Part 3: Subagent vs. Agent Team Decision (10 minutes)

For each scenario below, decide whether you would use a **subagent**, **agent team**, **single session**, or **Cowork**. Justify your choice in one sentence.

1. Investigate why a specific API endpoint returns 500 errors intermittently
2. Add input validation to 12 independent route handlers
3. Create a competitive analysis document from 5 competitor websites
4. Review a 2000-line PR for security, performance, and test coverage
5. Rename the `Customer` model to `Client` across 40 files in the codebase
6. Generate a weekly executive summary from Slack channel exports
7. Write unit tests for 3 services that have 0% coverage
8. Prototype 3 different UI approaches for a settings page

### Part 4: Reflect

1. What types of tasks benefit most from parallel AI agents vs. a single focused session?
2. How does file ownership affect the success of agent teams?
3. What is the break-even point where agent teams' token cost is justified by the speedup?
4. How would you integrate Cowork's scheduled tasks into your team's existing workflows?
5. What guardrails would you put in place before giving agent teams access to a production codebase?

---

## See Also

- [Module 3: Claude Code Essentials](/modules/03-claude-code-essentials) -- Subagents, MCP, and context management
- [Module 6: Agentic Workflows and Orchestration](/modules/06-agentic-workflows-and-orchestration) -- Orchestration patterns that agent teams build on
- [Module 7: Multi-User AI Collaboration](/modules/07-multi-user-ai-collaboration) -- Team conventions and CLAUDE.md for multi-developer setups
- [Module 17: Claude Code Project Setup](/modules/17-claude-code-project-setup) -- CLAUDE.md configuration that agent teams inherit
