"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function graphqlAuthenticationConfig(options) {
    const defaults = {
        requiredConfirmedEmailForLogin: false,
        validatePassword: value => value.length >= 8
    };
    if (!options.adapter) {
        throw new Error('You forgot to add the `adapter` option to graphql-authentication!');
    }
    return Object.assign(defaults, options);
}
exports.graphqlAuthenticationConfig = graphqlAuthenticationConfig;
