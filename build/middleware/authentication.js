"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTokenBasedAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
function handleTokenBasedAuth(req, res, next) {
    var _a;
    const authToken = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (authToken !== undefined) {
        jsonwebtoken_1.default.verify(authToken, config_1.config.token.secretKey, (err, tokenResult) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = tokenResult;
            return next();
        });
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
exports.handleTokenBasedAuth = handleTokenBasedAuth;
