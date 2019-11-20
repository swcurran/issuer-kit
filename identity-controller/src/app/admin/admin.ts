import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import Router = require('koa-router');
import invitationController from './invitation/invitation.controller';

const admin: Koa = new Koa();
const client = true;
// Generic error handling middleware.

const options = {
  origin: '*',
  allowHeaders: [
    'Content-Type',
    'content-type',
    'Authorization',
    'Accept',
    'Origin'
  ],
  allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS'
};
admin.use(bodyParser());

admin.use(cors(options));

admin.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

/*
if (client) {
  clientRoutes.forEach(route => app.use(route));
  clientMethods.forEach(route => app.use(route));
}
*/
admin.use(invitationController.routes());
admin.use(invitationController.allowedMethods());
// Application error logging.
admin.on('error', console.error);

export default admin;