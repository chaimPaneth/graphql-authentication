"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_errors_1 = require("apollo-errors");
exports.MissingDataError = apollo_errors_1.createError('MissingDataError', {
    message: 'Not all required fields are filled in.'
});
exports.InvalidEmailError = apollo_errors_1.createError('InvalidEmailError', {
    message: 'Given email is invalid.'
});
exports.ResetTokenExpiredError = apollo_errors_1.createError('ResetTokenExpiredError', {
    message: 'resetToken expired.'
});
exports.PasswordTooShortError = apollo_errors_1.createError('PasswordTooShortError', {
    message: 'Password is too short.'
});
exports.UserNotFoundError = apollo_errors_1.createError('UserNotFoundError', {
    message: 'No user found.'
});
exports.InvalidInviteTokenError = apollo_errors_1.createError('InvalidInviteTokenError', {
    message: 'inviteToken is invalid.'
});
exports.InvalidEmailConfirmToken = apollo_errors_1.createError('InvalidEmailConfirmToken', {
    message: 'emailConfirmToken is invalid.'
});
exports.UserEmailExistsError = apollo_errors_1.createError('UserEmailExistsError', {
    message: 'User already exists with this email.'
});
exports.UserInviteNotAcceptedError = apollo_errors_1.createError('UserInviteNotAcceptedError', {
    message: 'User has not accepted invite yet.'
});
exports.UserDeletedError = apollo_errors_1.createError('UserDeletedError', {
    message: 'User has been deleted.'
});
exports.UserEmailUnconfirmedError = apollo_errors_1.createError('UserEmailUnconfirmedError', {
    message: 'Users email has not been confirmed yet.'
});
exports.InvalidOldPasswordError = apollo_errors_1.createError('InvalidOldPasswordError', {
    message: 'Invalid old password.'
});
