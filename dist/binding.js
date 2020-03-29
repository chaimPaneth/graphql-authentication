"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_binding_1 = require("graphql-binding");
const schema_1 = require("./schema");
exports.Binding = graphql_binding_1.makeBindingClass({
    schema: schema_1.default
});
