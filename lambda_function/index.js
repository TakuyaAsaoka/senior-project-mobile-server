const AWS = require("aws-sdk");
const knex = require("./knex.js");
const data = require("./data.js");

// Lambda関数のエントリーポイント
exports.handler = async (event, context) => {
  const path = event.path;
  // リクエストメソッドの識別
  const method = event.httpMethod;
  const prefecture = event.pathParameters
    ? event.pathParameters.prefecture
    : "";
  const user = event.pathParameters ? event.pathParameters.user : "";
  const name = event.pathParameters ? event.pathParameters.name : "";
  try {
    // エンドポイントの識別
    console.log("user:", user);
    console.log("name:", name);
    // エンドポイントごとの処理を分岐
    switch (path) {
      case "/api/detail":
        switch (method) {
          case "GET":
            return getDetail(event, context);
        }
      case `/api/cards/${user}`:
        return getRandomCards(event, context);
      case "/api/favorites":
        switch (method) {
          case "GET":
            return getFavorites(event, context);
          case "POST":
            return postFavorites(event, context);
        }
      case "/api/favorites/all":
        switch (method) {
          case "DELETE":
            return deleteAllFavorites(event, context);
        }
      case `/api/favorites/${prefecture}`:
        switch (method) {
          case "GET":
            return getFavoritesByPrefecture(event, context);
          case "PATCH":
            return patchHasVisited(event, context);
        }
      case `/api/favorites/all/${user}`:
        switch (method) {
          case "GET":
            return getAllFavorites(event, context);
        }
      // 他のエンドポイントの処理を追加
      default:
        return {
          statusCode: 404,
          body: "Not Found",
        };
    }
  } catch (error) {
    // エラーハンドリング
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
};

// GET /api/cards/:user/?prefecture
async function getRandomCards(event, context) {
  try {
    // const blackList = [
    //   "小杉農園",
    //   "ポレポレ農園",
    //   "佐倉きのこ園",
    //   "無添加",
    //   "ブルーベリー",
    //   "直売所",
    //   "海の公園",
    //   "ふくろうの家",
    //   "占い",
    // ];
    // const arrOfReq = [
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303001&image=true",
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303002&image=true",
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303003&image=true",
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303004&image=true",
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303005&image=true",
    //   "https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&gc=0303011&image=true",
    // ];

    let prefecture = "";
    let deck = data;
    if (event.queryStringParameters) {
      if (event.queryStringParameters.prefecture) {
        prefecture = event.queryStringParameters.prefecture;
        deck = data.filter((card) => card.prefecture === prefecture);
      }
    }

    function generateRandomArray(number, max) {
      const actualNum = number <= deck.length ? number : deck.length;
      const result = [];
      // 重複のないランダムな数値を生成
      while (result.length < actualNum) {
        const randomNumber = Math.floor(Math.random() * max);
        if (result.indexOf(randomNumber) === -1) {
          result.push(randomNumber);
        }
      }
      return result;
    }

    // const arrOfRes = await Promise.all(
    //   arrOfReq.map(async (url) => {
    //     const res = await fetch(url);
    //     const data = await res.json();
    //     return data.Feature;
    //   })
    // );
    // const rowCards = arrOfRes.flat();
    // const rowDeck = rowCards.filter((card) => card.hasOwnProperty("Geometry"));
    // const deck = rowDeck.filter((card) => {
    //   let flag = true;
    //   for (const elm of blackList) {
    //     if (card.Name.includes(elm)) {
    //       flag = false;
    //     }
    //   }
    //   return flag;
    // });

    const randNums = generateRandomArray(10, deck.length);
    const cards = deck.filter((card, index) => {
      let flag = false;
      for (const num of randNums) {
        if (num === index) {
          flag = true;
        }
      }
      return flag;
    });
    const user = decodeURIComponent(event.pathParameters.user);

    // ユーザーのFAVORITEテーブルを取得
    const favorites = await knex("FAVORITE").select().where({ user_id: user });

    // レスポンスを作成
    const result = await Promise.all(
      cards.filter((card) => {
        let flag = true;
        for (const favorite of favorites) {
          if (card.name === favorite.name) {
            flag = false;
          }
        }
        return flag;
      })
      // .map(async (card) => {
      // const point = card.Geometry.Coordinates.split(",");
      // const x = point[0];
      // const y = point[1];
      // const geoRes = await fetch(
      //   `http://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x=${x}&y=${y}`
      // ).then((data) => {
      //   return data;
      // });
      // const geoData = await geoRes.json().then((data) => {
      //   return data;
      // });
      // const prefecture = geoData.response.location[0].prefecture;
      // const postal = geoData.response.location[0].postal;
      // const zipCode = postal.slice(0, 3) + "-" + postal.slice(-4);
      // return {
      //   name: card.Name ?? "",
      //   prefecture: prefecture,
      //   images: [card.Property.LeadImage],
      //   price: card.Property.Price ? Number(card.Property.Price) : 0,
      //   access: "電車",
      //   zip_code: zipCode ?? "",
      //   address: card.Property.Address ?? "",
      //   business: "",
      //   phone_number: card.Property.Tel1 ?? "",
      //   parking:
      //     card.Property.ParkingFlag === "1" ||
      //     card.Property.ParkingFlag === "true"
      //       ? "有り"
      //       : card.Property.ParkingFlag === "0" ||
      //         card.Property.ParkingFlag === "false"
      //       ? "無し"
      //       : "",
      //   toilet: "有り",
      //   closed: "年中無休",
      //   public_transport: card.Property.Station
      //     ? card.Property.Station.map(
      //         (elm) => elm.Railway + " " + elm.Name + "駅"
      //       )
      //     : [],
      //   car: [],
      //   has_visited: false,
      //   latitude: y,
      //   longitude: x,
      // };
      // })
    );

    // プロキシ統合形式に準拠したレスポンスを構築
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };

    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// GET /api/favorites
async function getFavorites(event, context) {
  try {
    const favorites = await knex("FAVORITE").select();

    const result = [];
    favorites.forEach((favorite) => {
      let flag = false;
      // すでに県がresultにあるか確認
      result.forEach((element) => {
        if (element.name === favorite.prefecture) {
          flag = true;
        }
      });
      // 県がすでにresultにあればnumberを加算、なければ県追加
      if (flag) {
        result.forEach((element) => {
          if (element.name === favorite.prefecture) {
            element.number++;
            if (favorite.has_visited) {
              element.hasVisitedNumber++;
            }
          }
        });
      } else {
        result.push({
          name: favorite.prefecture,
          imgSrc: favorite.images[0],
          number: 1,
          hasVisitedNumber: favorite.has_visited ? 1 : 0,
        });
      }
    });
    result.sort((a, b) => {
      return b.number - a.number;
    });
    // プロキシ統合形式に準拠したレスポンスを構築
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };

    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// GET /api/favorites/all/:user
async function getAllFavorites(event, context) {
  try {
    const user = event.pathParameters.user;
    const result = await knex("FAVORITE").select().where({ user_id: user });
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// POST /api/favorites
async function postFavorites(event, context) {
  try {
    const stringBody = JSON.stringify(event.body);
    const replacedBody = stringBody.replace(/\n\s+/g, "");
    const body = JSON.parse(replacedBody);
    const parsedBody = JSON.parse(body);
    await knex("FAVORITE").insert(parsedBody);

    const response = {
      statusCode: 200,
      body: JSON.stringify(event.body),
    };
    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// GET /api/detail/:user/:name
async function getDetail(event, context) {
  try {
    const user = event.queryStringParameters.user;
    const name = event.queryStringParameters.name;
    const result = await knex("FAVORITE")
      .select()
      .where({ user_id: user, name: name })
      .first();
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// POST /api/favorites
async function postFavorites(event, context) {
  try {
    stringBody = JSON.stringify(event.body);
    const replacedBody = stringBody.replace(/\n\s+/g, "");
    const body = JSON.parse(replacedBody);
    const parsedBody = JSON.parse(body);
    await knex("FAVORITE").insert(parsedBody);

    const response = {
      statusCode: 200,
      body: JSON.stringify(event.body),
    };
    return response;
  } catch (err) {
    console.error(err);

    // エラーレスポンスもプロキシ統合形式に準拠した形式で構築
    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// GET /api/favorites/:prefecture
async function getFavoritesByPrefecture(event, context) {
  const prefecture = decodeURIComponent(event.pathParameters.prefecture);
  console.log("prefecture:", prefecture);
  try {
    const favorites = await knex("FAVORITE")
      .select("id", "name", "images", "price", "access", "has_visited")
      .where({ prefecture: prefecture });

    const result = favorites.map((favorite) => ({
      id: favorite.id,
      name: favorite.name,
      imgSrc: favorite.images,
      price: favorite.price,
      access: favorite.access,
      hasVisited: favorite.has_visited,
    }));

    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    return response;
  } catch (err) {
    console.error(err);

    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// PATCH /api/favorites/:id
async function patchHasVisited(event, context) {
  const id = Number(event.pathParameters.prefecture); // リクエストからidを取得する必要があります

  try {
    const favorite = await knex("FAVORITE").where({ id }).first(); // 指定されたidのレコードを取得します

    if (!favorite) {
      const errorResponse = {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Favorite not found" }),
      };
      return errorResponse;
    }

    const updatedHasVisited = !favorite.has_visited; // has_visitedの値を切り替えます

    await knex("FAVORITE")
      .where({ id })
      .update({ has_visited: updatedHasVisited }); // レコードを更新します

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully updated" }),
    };

    return response;
  } catch (err) {
    console.error(err);

    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}

// DELETE /api/favorites/all
async function deleteAllFavorites(event, context) {
  try {
    await knex("FAVORITE").del();

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully deleted" }),
    };

    return response;
  } catch (err) {
    console.error(err);

    const errorResponse = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };

    return errorResponse;
  }
}
