import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar
        userName={session.user.name ?? "Admin"}
        userRole={session.user.role}
      />
      <div className="lg:pl-64">
        <Header
          userName={session.user.name ?? "Admin"}
          userEmail={session.user.email ?? ""}
          userRole={session.user.role}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
