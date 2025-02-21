import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-center">예약 요청이 완료되었습니다</CardTitle>
            <CardDescription className="text-center">
              예약이 확정되면 이메일로 알려드리겠습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>예약 확정을 위해 레스토랑에 연락드리고 있습니다.</p>
            <p>확정까지 최대 24시간이 소요될 수 있습니다.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">
                홈으로 돌아가기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}