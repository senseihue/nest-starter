"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenHash = createTokenHash;
const crypto_1 = require("crypto");
function createTokenHash(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
//# sourceMappingURL=token-hash.js.map