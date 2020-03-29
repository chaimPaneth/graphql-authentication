import { IGraphqlAuthenticationConfig } from './Config';
export interface Context {
    graphqlAuthentication: IGraphqlAuthenticationConfig;
    request?: any;
    req?: any;
}
export declare function getUserId(ctx: Context): string;
export declare function getUser(ctx: Context): Promise<any>;
export declare class AuthError extends Error {
    constructor();
}
export declare function isAuthResolver(parent: any, args: any, ctx: Context): boolean;
