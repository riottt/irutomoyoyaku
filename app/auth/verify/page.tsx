import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>メールを確認してください</CardTitle>
          <CardDescription>
            登録したメールアドレスに確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            メールが届かない場合は、迷惑メールフォルダもご確認ください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
