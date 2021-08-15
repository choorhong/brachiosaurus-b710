"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weekEnd = exports.weekStart = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const currentMomentDate = moment_timezone_1.default();
// currentMomentDate.tz('Asia/Kuala_Lumpur')
// Monday
exports.weekStart = currentMomentDate.clone().startOf('isoWeek');
// Sunday
exports.weekEnd = currentMomentDate.clone().endOf('isoWeek');
