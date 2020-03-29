"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const errors_1 = require("./errors");
function generateToken(user, ctx) {
    return jwt.sign({ userId: user.id }, ctx.graphqlAuthentication.secret);
}
function validatePassword(ctx, value) {
    if (!ctx.graphqlAuthentication.validatePassword(value)) {
        throw new errors_1.PasswordTooShortError();
    }
}
function getHashedPassword(value) {
    return bcrypt.hash(value, 10);
}
exports.mutations = {
    async signupByInvite(parent, { data }, ctx) {
        // Important first check, because i.e. the `inviteToken` could be an empty string
        // and in that case the find query beneath would find any user with any given email,
        // allowing you to change the password of everybody.
        if (!data.inviteToken || !data.email) {
            throw new errors_1.MissingDataError();
        }
        const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, data.email);
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        if (user.inviteToken !== data.inviteToken || user.inviteAccepted) {
            throw new errors_1.InvalidInviteTokenError();
        }
        validatePassword(ctx, data.password);
        const hashedPassword = await getHashedPassword(data.password);
        const updatedUser = await ctx.graphqlAuthentication.adapter.updateUserCompleteInvite(ctx, user.id, {
            firstName: data.firstName,
            lastName: data.lastName,
            inviteToken: '',
            inviteAccepted: true,
            password: hashedPassword
        });
        return {
            token: generateToken(user, ctx),
            user: updatedUser
        };
    },
    async signup(parent, { data }, ctx) {
        if (!data.email) {
            throw new errors_1.MissingDataError();
        }
        const userExists = await ctx.graphqlAuthentication.adapter.userExistsByEmail(ctx, data.email);
        if (userExists) {
            throw new errors_1.UserEmailExistsError();
        }
        validatePassword(ctx, data.password);
        const hashedPassword = await getHashedPassword(data.password);
        const emailConfirmToken = uuid_1.v4();
        const newUser = await ctx.graphqlAuthentication.adapter.createUserBySignup(ctx, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            emailConfirmToken,
            emailConfirmed: false,
            inviteAccepted: true,
            joinedAt: new Date().toISOString()
        });
        if (ctx.graphqlAuthentication.mailer) {
            ctx.graphqlAuthentication.mailer.send({
                template: 'signupUser',
                message: {
                    to: newUser.email
                },
                locals: {
                    mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
                    emailConfirmToken,
                    email: newUser.email
                }
            });
        }
        return {
            token: generateToken(newUser, ctx),
            user: newUser
        };
    },
    async confirmEmail(parent, { emailConfirmToken, email }, ctx) {
        if (!emailConfirmToken || !email) {
            throw new errors_1.MissingDataError();
        }
        const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, email);
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        if (user.emailConfirmToken !== emailConfirmToken || user.emailConfirmed) {
            throw new errors_1.InvalidEmailConfirmToken();
        }
        const updatedUser = await ctx.graphqlAuthentication.adapter.updateUserConfirmToken(ctx, user.id, {
            emailConfirmToken: '',
            emailConfirmed: true
        });
        return {
            token: generateToken(user, ctx),
            user: updatedUser
        };
    },
    async login(parent, { email, password }, ctx) {
        const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, email);
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        if (!user.inviteAccepted) {
            throw new errors_1.UserInviteNotAcceptedError();
        }
        if (user.deletedAt) {
            throw new errors_1.UserDeletedError();
        }
        if (ctx.graphqlAuthentication.requiredConfirmedEmailForLogin &&
            !user.emailConfirmed) {
            throw new errors_1.UserEmailUnconfirmedError();
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new errors_1.UserNotFoundError();
        }
        // Purposefully async, this update doesn't matter that much.
        ctx.graphqlAuthentication.adapter.updateUserLastLogin(ctx, user.id, {
            lastLogin: new Date().toISOString()
        });
        return {
            token: generateToken(user, ctx),
            user
        };
    },
    async changePassword(parent, { oldPassword, newPassword }, ctx) {
        const user = await utils_1.getUser(ctx);
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) {
            throw new errors_1.InvalidOldPasswordError();
        }
        validatePassword(ctx, newPassword);
        const password = await getHashedPassword(newPassword);
        const newUser = await ctx.graphqlAuthentication.adapter.updateUserPassword(ctx, user.id, { password });
        return {
            id: newUser.id
        };
    },
    async inviteUser(parent, { data }, ctx) {
        await utils_1.getUser(ctx);
        if (!validator.isEmail(data.email)) {
            throw new errors_1.InvalidEmailError();
        }
        const existingUser = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, data.email);
        if (existingUser) {
            if (ctx.graphqlAuthentication.hookInviteUserPostCreate) {
                await ctx.graphqlAuthentication.hookInviteUserPostCreate(data, ctx, existingUser);
            }
            return {
                id: existingUser.id
            };
        }
        // This token will be used in the email to the user.
        // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
        // uuid v4 is safe to be used as random token generator.
        const inviteToken = uuid_1.v4();
        const newUser = await ctx.graphqlAuthentication.adapter.createUserByInvite(ctx, {
            email: data.email,
            inviteToken,
            inviteAccepted: false,
            password: '',
            firstName: '',
            lastName: '',
            joinedAt: new Date().toISOString()
        });
        if (ctx.graphqlAuthentication.hookInviteUserPostCreate) {
            await ctx.graphqlAuthentication.hookInviteUserPostCreate(data, ctx, newUser);
        }
        if (ctx.graphqlAuthentication.mailer) {
            ctx.graphqlAuthentication.mailer.send({
                template: 'inviteUser',
                message: {
                    to: newUser.email
                },
                locals: {
                    mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
                    inviteToken,
                    email: newUser.email
                }
            });
        }
        return {
            id: newUser.id
        };
    },
    async triggerPasswordReset(parent, { email }, ctx) {
        if (!validator.isEmail(email)) {
            throw new errors_1.InvalidEmailError();
        }
        const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, email);
        if (!user) {
            return { ok: true };
        }
        // This token will be used in the email to the user.
        // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
        // uuid v4 is safe to be used as random token generator.
        const resetToken = uuid_1.v4();
        const now = new Date();
        // Expires in two hours
        const resetExpires = new Date(now.getTime() + 7200000).toISOString();
        await ctx.graphqlAuthentication.adapter.updateUserResetToken(ctx, user.id, {
            resetToken,
            resetExpires
        });
        if (ctx.graphqlAuthentication.mailer) {
            ctx.graphqlAuthentication.mailer.send({
                template: 'passwordReset',
                message: {
                    to: user.email
                },
                locals: {
                    mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
                    resetToken,
                    email
                }
            });
        }
        return {
            ok: true
        };
    },
    async passwordReset(parent, { email, resetToken, password }, ctx) {
        if (!resetToken || !password) {
            throw new errors_1.MissingDataError();
        }
        const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(ctx, email);
        if (!user || !user.resetExpires || user.resetToken !== resetToken) {
            throw new errors_1.UserNotFoundError();
        }
        if (new Date() > new Date(user.resetExpires)) {
            throw new errors_1.ResetTokenExpiredError();
        }
        validatePassword(ctx, password);
        const hashedPassword = await getHashedPassword(password);
        await ctx.graphqlAuthentication.adapter.updateUserResetToken(ctx, user.id, {
            resetToken: '',
            resetExpires: undefined
        });
        await ctx.graphqlAuthentication.adapter.updateUserPassword(ctx, user.id, {
            password: hashedPassword
        });
        return {
            id: user.id
        };
    },
    async updateCurrentUser(parent, { data }, ctx) {
        const user = await utils_1.getUser(ctx);
        await ctx.graphqlAuthentication.adapter.updateUserInfo(ctx, user.id, data);
        return user;
    }
};
