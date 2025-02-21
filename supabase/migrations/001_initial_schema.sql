-- users テーブル
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  email varchar not null unique,
  name varchar,
  phone varchar,
  language varchar default 'ko' check (language in ('ko', 'ja', 'en')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシー
alter table users enable row level security;
create policy "ユーザーは自分のデータのみ参照可能" on users
  for select using (auth.uid() = id);
create policy "ユーザーは自分のデータのみ更新可能" on users
  for update using (auth.uid() = id);

-- restaurants テーブル
create table restaurants (
  id uuid default gen_random_uuid() primary key,
  name varchar not null,
  name_ko varchar,
  description text,
  description_ko text,
  address varchar not null,
  phone varchar not null,
  cuisine_type varchar not null,
  price_range varchar not null check (price_range in ('¥', '¥¥', '¥¥¥', '¥¥¥¥')),
  opening_hours jsonb not null,
  image_urls text[],
  average_rating numeric(2,1) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシー
alter table restaurants enable row level security;
create policy "誰でも閲覧可能" on restaurants
  for select using (true);

-- reservations テーブル
create table reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  reservation_date date not null,
  reservation_time time not null,
  number_of_people integer not null check (number_of_people > 0),
  status varchar not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  payment_status varchar not null check (payment_status in ('pending', 'paid', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシー
alter table reservations enable row level security;
create policy "ユーザーは自分の予約のみ参照可能" on reservations
  for select using (auth.uid() = user_id);
create policy "ユーザーは自分の予約のみ更新可能" on reservations
  for update using (auth.uid() = user_id);

-- reviews テーブル
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  reservation_id uuid references reservations(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  image_urls text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, reservation_id)
);

-- RLSポリシー
alter table reviews enable row level security;
create policy "誰でもレビューを閲覧可能" on reviews
  for select using (true);
create policy "ユーザーは自分のレビューのみ作成可能" on reviews
  for insert with check (auth.uid() = user_id);
create policy "ユーザーは自分のレビューのみ更新可能" on reviews
  for update using (auth.uid() = user_id);

-- トリガー関数: 更新日時の自動更新
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 更新日時トリガーの設定
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

create trigger update_restaurants_updated_at
  before update on restaurants
  for each row
  execute function update_updated_at_column();

create trigger update_reservations_updated_at
  before update on reservations
  for each row
  execute function update_updated_at_column();

create trigger update_reviews_updated_at
  before update on reviews
  for each row
  execute function update_updated_at_column();
