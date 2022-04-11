"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("../express");
const database_1 = require("../database");
async function create_user(req, res) {
    const user = Object.assign({}, req.query);
    if (!user.first_name || !user.last_name || !user.email || !user.skill) {
        res.send({ success: false, error: "Missing required fields" });
    }
    try {
        const result = await database_1.database.create_user(user);
        res.send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "500 Error" });
    }
}
// Register APIs
express_1.app.get("/api/bracket/update_master", create_user.bind(this));
//# sourceMappingURL=bracket.js.map