import { Request, Response } from 'express';

const knex = require('../knex.js');

var express = require('express');
var router = express.Router();

// GET USER取得
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await knex('USER').select();
    res.status(200).json(users);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500).json(err);
  }
});

// POST USER追加
app.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    await knex('USER')
      .insert({ name, email, password })
      .then(() => res.sendStatus(200));
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
