"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
exports.toUserRolesResponse = toUserRolesResponse;
exports.toUsersPageResponse = toUsersPageResponse;
exports.toRemoveUserResponse = toRemoveUserResponse;
const pagination_response_1 = require("../../../shared/interceptors/pagination-response");
function toUserResponse(user) {
    return {
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
    };
}
function toUserRolesResponse(user, roles) {
    return {
        ...toUserResponse(user),
        roles,
    };
}
function toUsersPageResponse(users, page, limit, total) {
    return {
        items: users.map(toUserResponse),
        pagination: (0, pagination_response_1.buildPaginationMeta)(page, limit, total),
    };
}
function toRemoveUserResponse() {
    return { success: true };
}
//# sourceMappingURL=users.presenter.js.map