import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react"

export default async function RestaurantsPage() {
  const supabase = createServerSupabaseClient()
  
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error:', error)
    return <div>エラーが発生しました。</div>
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          홈으로
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">레스토랑 선택</h1>
          <p className="text-muted-foreground">현지 추천 맛집을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {restaurants?.map((restaurant) => (
            <Card key={restaurant.id} className="group hover:shadow-lg transition-shadow duration-200">
              {restaurant.image_urls && restaurant.image_urls[0] && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.image_urls[0]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{restaurant.name}</span>
                  <span className="text-sm font-normal flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    {restaurant.average_rating}
                  </span>
                </CardTitle>
                <CardDescription className="line-clamp-2">{restaurant.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {restaurant.cuisine_type}
                  </span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {restaurant.price_range}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full group-hover:bg-primary/90" asChild>
                  <Link href={`/restaurants/${restaurant.id}`}>
                    선택
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>찾으시는 레스토랑이 없나요?</CardTitle>
              <CardDescription>
                원하시는 레스토랑을 알려주시면 예약을 도와드리겠습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-4">
                <Input 
                  placeholder="원하는 레스토랑을 입력하세요" 
                  className="flex-1"
                />
                <Button>
                  요청하기
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-muted-foreground">
          <p>
            궁금한 점은{" "}
            <Link href="/contact" className="underline hover:text-primary">
              문의하기
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}