export interface Restaurant {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  address: string;
  addressKo: string;
  image: string;
  price: string;
  cuisine: string;
  rating: number;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "すし水谷",
    nameKo: "스시 미즈타니",
    description: "Traditional sushi restaurant with over 30 years of history",
    descriptionKo: "30년 전통의 정통 스시 레스토랑",
    address: "Tokyo, Ginza 4-5-6",
    addressKo: "도쿄 긴자 4-5-6",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000",
    price: "¥¥¥",
    cuisine: "寿司",
    rating: 4.8
  },
  {
    id: "2",
    name: "ラーメン一郎",
    nameKo: "라멘 이치로",
    description: "Famous ramen shop known for rich tonkotsu broth",
    descriptionKo: "진한 돈코츠 육수로 유명한 라멘집",
    address: "Tokyo, Shinjuku 1-2-3",
    addressKo: "도쿄 신주쿠 1-2-3",
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=1000",
    price: "¥",
    cuisine: "ラーメン",
    rating: 4.5
  },
  {
    id: "3",
    name: "焼肉太郎",
    nameKo: "야키니쿠 타로",
    description: "Premium yakiniku restaurant with A5 wagyu",
    descriptionKo: "A5 와규를 제공하는 프리미엄 야키니쿠",
    address: "Tokyo, Shibuya 7-8-9",
    addressKo: "도쿄 시부야 7-8-9",
    image: "https://images.unsplash.com/photo-1535631098394-d807539e169c?q=80&w=1000",
    price: "¥¥¥",
    cuisine: "焼肉",
    rating: 4.7
  }
];