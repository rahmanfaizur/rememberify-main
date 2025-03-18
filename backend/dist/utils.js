"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    const options = "qwertyuioplkmnkjhbbbvfgfdcxsaz";
    const length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * length);
        ans += options[randomIndex];
    }
    return ans;
}
