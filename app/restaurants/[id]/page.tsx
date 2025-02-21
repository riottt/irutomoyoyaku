"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurants } from "@/lib/restaurants";
import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// This function tells Next.js which routes to pre-render
export function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }));
}

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurant = restaurants.find((r) => r.id === params.id);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const handleReservation = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success message
    toast.success("예약 요청이 접수되었습니다!", {
      description: "확인 후 이메일로 연락드리겠습니다.",
    });
    
    // Redirect to payment page
    router.push(`/payment?reservation=${restaurant.id}`);
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          목록으로
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={restaurant.image}
              alt={restaurant.nameKo}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-6">
              <h1 className="text-3xl font-bold flex items-center justify-between">
                {restaurant.nameKo}
                <span className="text-lg font-normal flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
                  {restaurant.rating}
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">{restaurant.descriptionKo}</p>
              <div className="flex gap-2 mt-4">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {restaurant.cuisine}
                </span>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {restaurant.price}
                </span>
              </div>
              <p className="mt-4">
                <strong>주소:</strong> {restaurant.addressKo}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>예약하기</CardTitle>
              <CardDescription>
                예약 수수료: 1000엔
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleReservation(); }} className="space-y-6">
                <div className="space-y-4">
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
                </div>
                <Button type="submit" className="w-full">
                  예약 요청하기
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}