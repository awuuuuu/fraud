import Router from 'koa-router'

import transaction from './transaction'


const router = new Router();


router.use('/transaction', transaction.routes())


module.exports = router
