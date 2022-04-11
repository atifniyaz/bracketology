import { app } from "../express";
import { database } from "../database";
import { User } from "../types";

async function create_user(req, res) {
  const user: User = { ...req.query };
  if (!user.first_name || !user.last_name || !user.email || !user.skill) {
    res.send({ success: false, error: "Missing required fields" });
  }

  try {
    const result = await database.create_user(user);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "500 Error" });
  }
}

// Register APIs
app.get("/api/bracket/update_master", create_user.bind(this));
