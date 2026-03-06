import type { Module, UserProgress, ForumThread, ForumPost, User } from "@prisma/client"

export type ModuleWithProgress = Module & {
  progress: UserProgress | null
  resourceCount: number
}

export type ThreadWithMeta = ForumThread & {
  user: Pick<User, "name" | "id">
  _count: { posts: number }
  module: Pick<Module, "title" | "slug"> | null
  posts: { createdAt: Date }[]
}

export type PostWithReplies = ForumPost & {
  user: Pick<User, "name" | "id">
  _count: { upvotes: number }
  upvotes: { userId: string }[]
  replies: PostWithReplies[]
}

export type AnalyticsData = {
  moduleCompletion: {
    moduleId: string
    title: string
    completedCount: number
    totalUsers: number
  }[]
  userProgress: {
    userId: string
    name: string
    email: string
    completedModules: number
    totalModules: number
    lastActivity: Date | null
  }[]
  forumActivity: {
    totalThreads: number
    totalPosts: number
    postsThisWeek: number
    topContributors: { name: string; postCount: number }[]
  }
  engagementTrends: {
    date: string
    completions: number
    posts: number
  }[]
}
