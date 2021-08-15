"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const auth_2 = __importDefault(require("../middlewares/auth"));
const router = express_1.Router();
const authMiddleware = new auth_2.default();
const auth = new auth_1.default();
router.post('/create-find-user', authMiddleware.verifyToken, auth.createOrFindUser);
router.post('/update', authMiddleware.verifyToken, auth.update);
exports.default = router;
