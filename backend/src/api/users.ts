import { app } from "../express";
import { User } from "../types";

async function bracket_create(req, res) {
  res.send(req.body);
}

// Register APIs
app.post("/api/users/bracket/create", bracket_create.bind(this));
