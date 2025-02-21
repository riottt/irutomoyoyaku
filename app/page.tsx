import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurants } from "@/lib/restaurants";
import { Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            일본 맛집 예약
          </h1>
          <p className="text-lg md:text-xl mb-8">
            현지 맛집을 한국어로 쉽게 예약하세요
          </p>
          <Button size="lg" asChild>
            <Link href="#restaurants">
              지금 예약하기
            </Link>
          </Button>
        </div>
      </section>

      {/* Restaurant List Section */}
      <section id="restaurants" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          추천 레스토랑
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.nameKo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{restaurant.nameKo}</span>
                  <span className="text-sm font-normal flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    {restaurant.rating}
                  </span>
                </CardTitle>
                <CardDescription>{restaurant.descriptionKo}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {restaurant.addressKo}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {restaurant.cuisine}
                  </span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {restaurant.price}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/restaurants/${restaurant.id}`}>
                    예약하기
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 px-4 md:px-8 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            서비스 특징
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">간편한 예약</h3>
              <p className="text-muted-foreground">
                한국어로 쉽게 예약할 수 있습니다
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">전문 스태프</h3>
              <p className="text-muted-foreground">
                일본어 예약을 대행해드립니다
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">합리적인 가격</h3>
              <p className="text-muted-foreground">
                예약 건당 1000엔의 수수료
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}