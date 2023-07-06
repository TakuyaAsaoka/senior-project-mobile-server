/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("FAVORITE").del();
  await knex("FAVORITE").insert([
    {
      user_id: "test",
      name: "香嵐渓",
      prefecture: "愛知県",
      images: JSON.stringify([
        "https://www.tripyhotellounge.xyz/wp-content/uploads/2022/10/Fukazawa050.jpg",
        "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/02/10/12/16/55/Korankei.jpg",
        "https://mitsu-log.com/wp-content/uploads/2022/07/23008080_s-1.jpg",
        "https://tori-dori.com/wp/wp-content/uploads/EBP15-44444.jpg",
      ]),
      price: 0,
      access: "車",
      zip_code: "444-2424",
      address: "愛知県豊田市足助町飯盛",
      business: "見学終日",
      phone_number: "0565-62-1272",
      parking: "有料・香嵐渓駐車場（約670台）1台500円",
      toilet: "あり",
      closed: "なし",
      public_transport: JSON.stringify([
        "名鉄豊田線「浄水駅」より、とよたおいでんバス猿投足助線に乗り換え「香嵐渓」バス停下車。徒歩すぐ",
        "名鉄三河線/豊田線「豊田市駅」より、名鉄バス矢並線に乗り換え「香嵐渓」バス停下車。徒歩すぐ",
        "名鉄本線「東岡崎駅」より、名鉄バス足助線に乗り換え「香嵐渓」バス停下車。徒歩すぐ",
      ]),
      car: JSON.stringify([
        "猿投グリーンロード「力石IC」から約15分",
        "東海環状自動車道「豊田勘八IC」から約20分",
      ]),
      has_visited: false,
      latitude: 35.1303227,
      longitude: 137.3128285,
    },
    {
      user_id: "test",
      name: "名古屋城",
      prefecture: "愛知県",
      images: JSON.stringify([
        "https://cdn-news.asoview.com/production/note/05a9e06f-f4c9-4632-a1e5-94d55e4ab29a.jpeg",
      ]),
      price: 500,
      access: "電車",
      zip_code: "460-0031",
      address: "愛知県名古屋市中区本丸1-1",
      business: "午前9時～午後4時30分",
      phone_number: "052-231-1700",
      parking: "正門前駐車場（普通車308台）普通車30分以内ごと180円",
      toilet: "あり",
      closed: "12月29日～31日、1月1日(4日間)",
      public_transport: JSON.stringify([
        "地下鉄 名城線 「名古屋城」 下車 7番出口より徒歩 5分",
        "地下鉄 鶴舞線 「浅間町」 下車 1番出口より徒歩12分",
        "名鉄 瀬戸線 「東大手」 下車 徒歩15分",
      ]),
      car: JSON.stringify([
        "名古屋高速1号楠線 「黒川」 出口から南へ8分",
        "名古屋高速都心環状線 「丸の内」 出口から北へ5分",
      ]),
      has_visited: false,
      latitude: 35.1855875,
      longitude: 136.8990919,
    },
    {
      user_id: "test",
      name: "刈谷ハイウェイオアシス",
      prefecture: "愛知県",
      images: JSON.stringify([
        "https://anniversarys-mag.jp/img/p/pixta_44462056_M.jpg?w=730",
      ]),
      price: 0,
      access: "車",
      zip_code: "448-0007",
      address: "愛知県刈谷市東境町吉野55番地",
      business: "7:00～22:00",
      phone_number: "0566-35-0211",
      parking: "無料",
      toilet: "あり",
      closed: "年中無休",
      public_transport: JSON.stringify([
        "JR東海道線 「刈谷駅」 下車 刈谷市公共施設連絡バス「かりまる」東境線「洲原温泉プール行き」34分",
        "名鉄三河線 「刈谷駅」 下車 刈谷市公共施設連絡バス「かりまる」西境線「刈谷ハイウェイオアシス行き」47分",
        "名鉄三河線 「富士松駅」 下車 刈谷市公共施設連絡バス「かりまる」西境線「刈谷ハイウェイオアシス行き」23分",
      ]),
      car: JSON.stringify([
        "県道289号線（富士松停車場線）を北東へ 東境町向イ郷」交差点を右折（東へ）道なりに進み、伊勢湾岸自動車道の高架をくぐり、すぐ左手",
        "国道1号線「今川町東」交差点を左折（北東へ）「東境町向イ郷」交差点を右折（東へ）道なりに進み、伊勢湾岸自動車道の高架をくぐり、すぐ左手",
      ]),
      has_visited: false,
      latitude: 35.04140468215912,
      longitude: 137.04887465366775,
    },
  ]);
};
