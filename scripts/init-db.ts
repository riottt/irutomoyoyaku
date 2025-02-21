import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgcpbvxqnyjnfxjcpbki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY3BidnhxbnlqbmZ4amNwYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNTYzNjEsImV4cCI6MjA1NTczMjM2MX0.3u45VL9do-emLhHHFslfeH3NYujJ5tnZDNWXdgFnmuU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  try {
    // Insert sample data
    const { error } = await supabase.from('restaurants').insert([
      {
        name: '築地寿司清',
        description: '伝統的な江戸前寿司の名店。新鮮な魚介類と熟練の職人技が光ります。',
        address: '東京都中央区築地4-10-10',
        image_url: 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/sushi-sei.jpg',
        price_range: '¥¥¥',
        cuisine_type: '寿司'
      },
      {
        name: '炭火焼肉 和牛義',
        description: '最高級の和牛を炭火で楽しめる焼肉店。プライベート空間で贅沢なひとときを。',
        address: '東京都渋谷区神南1-20-15',
        image_url: 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/yakiniku-yoshiki.jpg',
        price_range: '¥¥¥¥',
        cuisine_type: '焼肉'
      },
      {
        name: '蕎麦 一心',
        description: '石臼挽きの十割蕎麦と季節の天ぷらが自慢。静かな空間で味わう本格蕎麦。',
        address: '東京都千代田区神田神保町2-3',
        image_url: 'https://tgcpbvxqnyjnfxjcpbki.supabase.co/storage/v1/object/public/restaurant-images/soba-isshin.jpg',
        price_range: '¥¥',
        cuisine_type: '蕎麦'
      }
    ]);

    if (error) {
      console.error('Error inserting data:', error);
      return;
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

initDatabase();
