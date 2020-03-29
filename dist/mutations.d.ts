import { Context } from './utils';
import { User } from './Adapter';
import { SignupByInviteInput, SignupInput, InviteUserInput, UserUpdateInput } from './binding';
export declare const mutations: {
    signupByInvite(parent: any, { data }: {
        data: SignupByInviteInput;
    }, ctx: Context): Promise<{
        token: string;
        user: User | null;
    }>;
    signup(parent: any, { data }: {
        data: SignupInput;
    }, ctx: Context): Promise<{
        token: string;
        user: User;
    }>;
    confirmEmail(parent: any, { emailConfirmToken, email }: {
        emailConfirmToken: string;
        email: string;
    }, ctx: Context): Promise<{
        token: string;
        user: User | null;
    }>;
    login(parent: any, { email, password }: {
        email: string;
        password: string;
    }, ctx: Context): Promise<{
        token: string;
        user: User;
    }>;
    changePassword(parent: any, { oldPassword, newPassword }: {
        oldPassword: string;
        newPassword: string;
    }, ctx: Context): Promise<{
        id: string;
    }>;
    inviteUser(parent: any, { data }: {
        data: InviteUserInput;
    }, ctx: Context): Promise<{
        id: string;
    }>;
    triggerPasswordReset(parent: any, { email }: {
        email: string;
    }, ctx: Context): Promise<{
        ok: boolean;
    }>;
    passwordReset(parent: any, { email, resetToken, password }: {
        email: string;
        resetToken: string;
        password: string;
    }, ctx: Context): Promise<{
        id: string;
    }>;
    updateCurrentUser(parent: any, { data }: {
        data: UserUpdateInput;
    }, ctx: Context): Promise<any>;
};
