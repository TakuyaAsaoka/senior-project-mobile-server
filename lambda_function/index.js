const AWS = require("aws-sdk");
// 他の必要なモジュールのインポート
const express = require("express");
const app = express();
const knex = require("./knex.js");

// Lambda関数のエントリーポイント
exports.handler = async (event, context) => {
  try {
    // エンドポイントの識別
    const path = event.path;
    // リクエストメソッドの識別
    const method = event.httpMethod;
    console.log("method: ", method);

    // エンドポイントごとの処理を分岐
    switch (path) {
      case "/api/favorites":
        switch (method) {
          case "GET":
            return getFavorites(event, context);
        }
      case "/api/endpoint2":
        return handleEndpoint2(event, context);
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

//
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

// エンドポイント2の処理
async function handleEndpoint2(event, context) {
  // エンドポイント2のロジックを記述
  // ...

  // レスポンスの生成
  const response = {
    statusCode: 200,
    body: "Endpoint 2",
  };

  return response;
}

// 他のエンドポイントの処理を追加
