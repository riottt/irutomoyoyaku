import { AuthForm } from '@/components/auth/auth-form'

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10">
      <AuthForm mode="signup" />
    </div>
  )
}
