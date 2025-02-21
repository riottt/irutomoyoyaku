"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurants } from "@/lib/restaurants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const restaurantId = searchParams.get("reservation");
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return <div>Invalid reservation</div>;
  }

  const handlePayment = async () => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("결제가 완료되었습니다!", {
      description: "예약이 확정되면 이메일로 알려드리겠습니다.",
    });
    
    router.push("/confirmation");
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          돌아가기
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>결제하기</CardTitle>
            <CardDescription>
              예약 수수료를 결제해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>레스토랑</span>
              <span className="font-medium">{restaurant.nameKo}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>예약 수수료</span>
              <span className="font-medium">¥1,000</span>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>총 금액</span>
              <span>¥1,000</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handlePayment}>
              결제하기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}