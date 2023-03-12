"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsJSON = void 0;
function IsJSON(data) {
    try {
        JSON.parse(data);
        return true;
    }
    catch (ex) {
        return false;
    }
}
exports.IsJSON = IsJSON;
