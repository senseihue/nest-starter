"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loggable = exports.LOGGABLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.LOGGABLE_KEY = 'loggable';
const Loggable = (message) => (0, common_1.SetMetadata)(exports.LOGGABLE_KEY, { message });
exports.Loggable = Loggable;
//# sourceMappingURL=log.decorator.js.map