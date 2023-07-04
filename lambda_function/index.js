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
        switch (method) {
          case "GET":
            return getDetail(event, context);
          case "PATCH":
            return patchHasVisited(event, context);
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
    console.error(error);
    return {
      statusCode: 500,
      body: "Error",
    };
  }
};

// GET /api/cards
async function getRandomCards(event, context) {
  try {
    const number = 10;
    const start = Math.floor(Math.random() * 201);
    const url = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=dj00aiZpPU9USnZwMHRxWDQ5TCZzPWNvbnN1bWVyc2VjcmV0Jng9NDQ-&output=json&results=${number}&start=${start}&gc=0303&image=true`;
    const res = await fetch(url);
    const data = await res.json();
    const cards = data.Feature;

    // レスポンスを作成
    const result = cards.map(async (card) => {
      const point = card.Geometry.Coordinates.split(",");
      const x = point[0];
      const y = point[1];
      const geoRes = await fetch(
        `http://geoapi.heartrails.com/api/json?method=getAreas&x=${x}&y=${y}`
      );
      const geoData = await geoRes.json();
      const prefecture = geoData.response.location[0].prefecture;
      const postal = geoData.response.location[0].postal;
      const zipCode = postal.slice(0, 3) & "-" & postal.slice(-4);
      return {
        name: card.Name,
        prefecture: prefecture,
        image: [card.Property.LeadImage],
        price: "",
        access: "",
        zipCode: zipCode,
        address: card.Property.Address,
        business: "",
        phoneNumber: card.Property.Tel1 ?? "",
        parking:
          card.Property.ParkingFlag === "1" ||
          card.Property.ParkingFlag === "true"
            ? "有り"
            : card.Property.ParkingFlag === "0" ||
              card.Property.ParkingFlag === "false"
            ? "無し"
            : "",
        toilet: "",
        closed: "",
        publicTransport: card.Property.Station.map(
          (elm) => elm.Railway & " " & elm.Name & "駅"
        ),
        car: [],
        hasVisited: false,
        latitude: y,
        longitude: x,
      };
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
async function getDetail(event, context) {
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
