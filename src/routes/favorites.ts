import { Request, Response } from 'express';

const knex = require('../knex.js');
// const environment = process.env.NODE_ENV || 'development';
// const config = require('../knexfile.js')[environment];
// const knex = require('knex')(config);

var express = require('express');
var router = express.Router();

// GET 県別いいね一覧データ取得 { name: "愛知県", imgSrc: "https~", number: 3 }
router.get('/', async (req: Request, res: Response, next: () => void) => {
  try {
    // FAVORITEテーブル取得
    const favorites = await knex('FAVORITE').select();

    // レスポンスのためにデータ加工。
    const result: Object[] = [];

    favorites.forEach((favorite1: any) => {
      let flg: boolean = true;
      let elm: any = {};

      // 既にresultに県データがあるか確認
      result.forEach((obj: any) => {
        if (obj.name === favorite1.prefecture) flg = false;
      });

      // 県データを作り込み、result配列にpushする
      if (flg) {
        elm.name = favorite1.prefecture;
        elm.imgSrc = favorite1.images[0];

        let count = 0;
        favorites.forEach((favorite2: any) => {
          if (favorite1.name === favorite2.name) count++;
        });
        elm.number = count;

        result.push(elm);
      }
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500).json(err);
  }
});

// GET スポット別一覧データ取得
router.get('/:prefecture', async (req: Request, res: Response, next: () => void) => {
  try {
    const prefecture: string = req.params.prefecture;
    const favorites: Object[] = await knex('FAVORITE')
      .select('id', 'title', 'images', 'price', 'access')
      .where({ prefecture: prefecture });
    const result: Object[] = [];
    favorites.forEach((favorite: any) => {
      result.push({
        id: favorite.id,
        name: favorite.title,
        imgSrc: favorite.images[0],
        price: favorite.price,
        access: favorite.access,
      });
    });
    res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

// POST FAVORITEテーブル追加
router.post('/', async (req: Request, res: Response, next: () => void) => {
  const body = await req.body;
  knex('FAVORITE')
    .insert(body)
    .then(() => {
      res.set('content-type', 'application/json').status(200).send(body);
    })
    .catch((err: any) => {
      console.error(err);
      res.sendStatus(500).json(err);
    });
});

// DELETE FAVORITEテーブル削除
router.delete('/', (req: Request, res: Response, next: () => void) => {
  knex('FAVORITE')
    .del()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
