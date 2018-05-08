import Router from 'koa-router'
import mountController from '../middlewares/mountController'

const router = new Router();

export default router
  .get('/list', mountController((params, query, body, context) => ({
    data: [1, 2, 3, 4, 5]
  })))
