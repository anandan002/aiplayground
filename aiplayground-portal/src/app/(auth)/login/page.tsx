import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { BrainCircuit } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-10 w-10 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight">AIPlayground</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Learn AI/ML concepts through interactive modules
        </p>
      </div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
