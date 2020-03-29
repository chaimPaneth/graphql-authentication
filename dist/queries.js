"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.queries = {
    currentUser(parent, args, ctx, info) {
        const id = utils_1.getUserId(ctx);
        return ctx.graphqlAuthentication.adapter.findUserById(ctx, id, info);
    }
};
