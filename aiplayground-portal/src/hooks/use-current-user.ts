"use client"

import { useSession } from "next-auth/react"

export function useCurrentUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isAdmin: session?.user?.role === "ADMIN",
    isLoading: status === "loading",
  }
}
