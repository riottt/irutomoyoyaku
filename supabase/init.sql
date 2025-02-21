-- Create users table
create table if not exists users (
    id uuid default gen_random_uuid() primary key,
    email varchar(255) not null unique,
    name varchar(50),
    phone varchar(20),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create restaurants table
create table if not exists restaurants (
    id uuid default gen_random_uuid() primary key,
    name varchar(100) not null,
    address varchar(255) not null,
    description text,
    image_url text,
    cuisine_type varchar(50),
    price_range varchar(10),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reservations table
create table if not exists reservations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references users(id),
    restaurant_id uuid references restaurants(id),
    reservation_date timestamp with time zone not null,
    party_size integer not null,
    status text default 'pending',
    payment_status text default 'pending',
    payment_amount integer default 1000,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample restaurants
insert into restaurants (name, address, description, image_url, cuisine_type, price_range)
values 
    ('築地寿司清', '東京都中央区築地4-10-10', '伝統的な江戸前寿司の名店。新鮮な魚介類と熟練の職人技が光ります。', 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/sushi-sei.jpg', '寿司', '¥¥¥'),
    ('炭火焼肉 和牛義', '東京都渋谷区神南1-20-15', '最高級の和牛を炭火で楽しめる焼肉店。プライベート空間で贅沢なひとときを。', 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/yakiniku-yoshiki.jpg', '焼肉', '¥¥¥¥'),
    ('蕎麦 一心', '東京都千代田区神田神保町2-3', '石臼挽きの十割蕎麦と季節の天ぷらが自慢。静かな空間で味わう本格蕎麦。', 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/soba-isshin.jpg', '蕎麦', '¥¥');
