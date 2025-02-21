import { AuthForm } from '@/components/auth/auth-form'

export default function SignInPage() {
  return (
    <div className="container mx-auto py-10">
      <AuthForm mode="signin" />
    </div>
  )
}
