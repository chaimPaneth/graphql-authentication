import * as Email from 'email-templates';
import { User } from './Adapter';
import { Context } from './utils';
import { GraphqlAuthenticationAdapter } from './Adapter';
export interface IGraphqlAuthenticationConfig {
    mailer?: Email;
    mailAppUrl?: string;
    secret: string;
    requiredConfirmedEmailForLogin?: boolean;
    hookInviteUserPostCreate?: (data: any, ctx: Context, user: User) => Promise<any>;
    adapter: GraphqlAuthenticationAdapter;
    validatePassword?: (value: string) => boolean;
}
export declare function graphqlAuthenticationConfig(options: IGraphqlAuthenticationConfig): {
    requiredConfirmedEmailForLogin: boolean;
    validatePassword: (value: any) => boolean;
} & IGraphqlAuthenticationConfig;
