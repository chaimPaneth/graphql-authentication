"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const graphql_tools_1 = require("graphql-tools");
const graphql_import_1 = require("graphql-import");
// This is only used for generating `src/binding.ts`
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: graphql_import_1.importSchema(path.resolve('schema.graphql'))
});
