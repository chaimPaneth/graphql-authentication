import { Context } from './utils';
import { User } from './Adapter';
export declare const queries: {
    currentUser(parent: any, args: any, ctx: Context, info: any): Promise<User | null>;
};
