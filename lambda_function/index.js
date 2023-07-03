const AWS = require("aws-sdk");
const knex = require("./knex.js");

// Lambda関数のエントリーポイント
exports.handler = async (event, context) => {
  try {
    // エンドポイントの識別
    const path = event.path;
    // リクエストメソッドの識別
    const method = event.httpMethod;
    const prefecture = event.pathParameters.prefecture;
    // エンドポイントごとの処理を分岐
    switch (path) {
      case "/api/cards":
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
        return getDetail(event, context);
      // 他のエンドポイントの処理を追加
      default:
        return {
          statusCode: 404,
          body: "Not Found",
        };
    }
  } catch (error) {
    // エラーハンドリング
    console.error(error);
    return {
      statusCode: 500,
      body: "Errorです",
    };
  }
};

// GET /api/cards
async function getRandomCards(event, context) {
  try {
    const number = 10;
    const start = Math.floor(Math.random() * 15001);
    console.log("number:", number);
    console.log("start:", start);
    const url = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&results=${number}&start=${start}&gc=03,0303`;
    console.log("url:", url);
    const cards = await fetch(url);
    // プロキシ統合形式に準拠したレスポンスを構築
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: "JSON.stringify(cards)",
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
          }
        });
      } else {
        result.push({
          name: favorite.prefecture,
          imgSrc: favorite.images[0],
          number: 1,
        });
      }
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

// POST /api/favorites
async function postFavorites(event, context) {
  try {
    console.log("event.body", event.body);
    await knex("FAVORITE").insert(event.body);

    const response = {
      statusCode: 200,
      body: JSON.stringify(event.body),
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

async function getDetail(event, context) {
  const prefecture = decodeURIComponent(event.pathParameters.prefecture);
  console.log("prefecture:", prefecture);
  try {
    const favorites = await knex("FAVORITE")
      .select("id", "name", "images", "price", "access")
      .where({ prefecture: prefecture });

    const result = favorites.map((favorite) => ({
      id: favorite.id,
      name: favorite.name,
      imgSrc: favorite.images,
      price: favorite.price,
      access: favorite.access,
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
