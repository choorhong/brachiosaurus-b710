"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.checkEmpty = exports.generateUUID = void 0;
const uuid_1 = require("uuid");
const lodash_1 = require("lodash");
const generateUUID = () => uuid_1.v4();
exports.generateUUID = generateUUID;
/**
 *
 * @param undefined, null, {}, [], '' > true
 * @returns boolean
 */
const checkEmpty = (value) => {
    if (value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0 && !lodash_1.isDate(value)) ||
        (typeof value === 'string' && value.trim().length === 0))
        return true;
    return false;
};
exports.checkEmpty = checkEmpty;
const isEmpty = (arr) => {
    return arr.some(exports.checkEmpty);
};
exports.isEmpty = isEmpty;
