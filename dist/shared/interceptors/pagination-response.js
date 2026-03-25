"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = buildPaginationMeta;
function buildPaginationMeta(page, limit, total) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
        page,
        limit,
        total,
        totalPages,
    };
}
//# sourceMappingURL=pagination-response.js.map