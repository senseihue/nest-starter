"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthUserResponse = toAuthUserResponse;
function toAuthUserResponse(user) {
    return {
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
    };
}
//# sourceMappingURL=auth.presenter.js.map