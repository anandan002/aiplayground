"use client"

import { useState, useEffect, useCallback } from "react"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"
import { StatsCards } from "@/components/admin/stats-cards"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import type { AnalyticsData } from "@/types"

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics")
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load analytics data.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Overview of platform usage and engagement.
        </p>
      </div>

      <StatsCards data={data} />
      <AnalyticsCharts data={data} />
    </div>
  )
}
