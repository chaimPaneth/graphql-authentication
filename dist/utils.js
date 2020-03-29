"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
function _getUserId(ctx) {
    // For Apollo Server 2.0+ it is ctx.req and for GraphQL Yoga ctx.request. Maybe there is a better way...
    const Authorization = (ctx.req || ctx.request).get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, ctx.graphqlAuthentication.secret);
        return userId;
    }
    return '';
}
function getUserId(ctx) {
    const userId = _getUserId(ctx);
    if (userId) {
        return userId;
    }
    throw new AuthError();
}
exports.getUserId = getUserId;
function getUser(ctx) {
    return ctx.graphqlAuthentication.adapter.findUserById(ctx, getUserId(ctx));
}
exports.getUser = getUser;
class AuthError extends Error {
    constructor() {
        super('Not authorized');
    }
}
exports.AuthError = AuthError;
function isAuthResolver(parent, args, ctx) {
    return !!_getUserId(ctx);
}
exports.isAuthResolver = isAuthResolver;
