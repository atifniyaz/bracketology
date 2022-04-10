"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("../express");
async function bracket_create(req, res) {
    console.log("test2");
    res.send({ success: true });
}
// Register APIs
express_1.app.post("/api/users/bracket/create", bracket_create.bind(this));
//# sourceMappingURL=users.js.map