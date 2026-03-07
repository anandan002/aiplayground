import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const modules = [
  {
    slug: "ai-assisted-dev-foundations",
    title: "AI-Assisted Dev Foundations",
    description: "Understanding the AI-assisted development landscape, mental models, and when to leverage AI tools effectively.",
    order: 1,
    contentFilePath: "content/modules/01-ai-assisted-dev-foundations.md",
  },
  {
    slug: "github-copilot-essentials",
    title: "GitHub Copilot Essentials",
    description: "Master GitHub Copilot's tab completion, inline suggestions, and chat features for everyday coding.",
    order: 2,
    contentFilePath: "content/modules/02-github-copilot-essentials.md",
  },
  {
    slug: "claude-code-essentials",
    title: "Claude Code Essentials",
    description: "Learn the CLI-based AI assistant workflow — tools, context management, MCP servers, and skills.",
    order: 3,
    contentFilePath: "content/modules/03-claude-code-essentials.md",
  },
  {
    slug: "copilot-vs-claude-code",
    title: "Copilot vs Claude Code",
    description: "When to use which tool — strengths, weaknesses, and combining both for maximum productivity.",
    order: 4,
    contentFilePath: "content/modules/04-copilot-vs-claude-code.md",
  },
  {
    slug: "prompt-engineering-for-developers",
    title: "Prompt Engineering for Developers",
    description: "Craft effective prompts for AI coding tools — context, constraints, examples, and iterative refinement.",
    order: 5,
    contentFilePath: "content/modules/05-prompt-engineering-for-developers.md",
  },
  {
    slug: "agentic-workflows-and-orchestration",
    title: "Agentic Workflows & Orchestration",
    description: "Multi-step autonomous AI tasks — orchestration patterns, subagents, and knowing when to go agentic.",
    order: 6,
    contentFilePath: "content/modules/06-agentic-workflows-and-orchestration.md",
  },
  {
    slug: "multi-user-ai-collaboration",
    title: "Multi-User AI Collaboration",
    description: "Team workflows with AI — shared conventions, branch strategies, code review, and knowledge management.",
    order: 7,
    contentFilePath: "content/modules/07-multi-user-ai-collaboration.md",
  },
  {
    slug: "requirement-traceability-preventing-hallucination",
    title: "Requirement Traceability & Preventing Hallucination",
    description: "Verify AI-generated code against requirements — catch hallucinations, fake APIs, and invented libraries.",
    order: 8,
    contentFilePath: "content/modules/08-requirement-traceability-preventing-hallucination.md",
  },
  {
    slug: "ai-assisted-testing",
    title: "AI-Assisted Testing",
    description: "AI-powered test generation, coverage analysis, edge case discovery, and TDD with AI tools.",
    order: 9,
    contentFilePath: "content/modules/09-ai-assisted-testing.md",
  },
  {
    slug: "secure-code-generation",
    title: "Secure Code Generation",
    description: "Security risks in AI-generated code — OWASP patterns, secure prompting, dependency checks, and review checklists.",
    order: 10,
    contentFilePath: "content/modules/10-secure-code-generation.md",
  },
  {
    slug: "ai-dev-best-practices",
    title: "AI-Assisted Dev Best Practices & Governance",
    description: "Trust gradient, governance frameworks, legal considerations, metrics, rollout plans, and anti-patterns for AI-assisted development.",
    order: 11,
    contentFilePath: "content/modules/11-ai-dev-best-practices.md",
  },
  {
    slug: "ai-boundary-enforcement",
    title: "AI Boundary Enforcement",
    description: "CODEOWNERS integration, path guards, agent sandboxing, and cross-team protocols for enforcing AI boundaries.",
    order: 12,
    contentFilePath: "content/modules/12-ai-boundary-enforcement.md",
  },
  {
    slug: "ai-development-lifecycle",
    title: "AI-Enabled Development Lifecycle",
    description: "The 7-phase AI development lifecycle from analysis to deployment, with quality gates and plan validation.",
    order: 13,
    contentFilePath: "content/modules/13-ai-development-lifecycle.md",
  },
  {
    slug: "ai-hybrid-workflow",
    title: "AI + Manual Hybrid Workflow",
    description: "Sprint ceremonies, story decomposition, and daily workflow patterns for teams combining AI and manual development.",
    order: 14,
    contentFilePath: "content/modules/14-ai-hybrid-workflow.md",
  },
  {
    slug: "git-multi-user-playbook",
    title: "Git Multi-User Playbook",
    description: "Branching models, merge queues, bot governance, and monorepo strategies for multi-user AI-assisted Git workflows.",
    order: 15,
    contentFilePath: "content/modules/15-git-multi-user-playbook.md",
  },
  {
    slug: "htc-ai-dev-pov",
    title: "HTC AI-Assisted Development POV",
    description: "HTC's strategic framework for safe, scalable AI-enabled software engineering including Trust Gradient, 5 principles, and scaling roadmap.",
    order: 16,
    contentFilePath: "content/modules/16-htc-ai-dev-pov.md",
  },
  {
    slug: "claude-code-project-setup",
    title: "Setting Up Claude Code for Your Project",
    description: "Step-by-step guide to configuring CLAUDE.md, custom commands, hooks, MCP servers, and team conventions.",
    order: 17,
    contentFilePath: "content/modules/17-claude-code-project-setup.md",
  },
  {
    slug: "claude-cowork-and-agent-teams",
    title: "Claude Cowork & Agent Teams",
    description: "Claude Cowork for desktop knowledge work (scheduled tasks, plugins, file management) and Claude Code Agent Teams for multi-agent parallel development.",
    order: 18,
    contentFilePath: "content/modules/18-claude-cowork-and-agent-teams.md",
  },
]

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@aiplayground.dev" },
    update: {},
    create: {
      email: "admin@aiplayground.dev",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  })

  // Create modules
  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: { title: mod.title, description: mod.description, order: mod.order, contentFilePath: mod.contentFilePath },
      create: mod,
    })
  }

  console.log(`Seed completed: admin user + ${modules.length} modules`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
