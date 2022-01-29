import { app } from "../express";
import { database } from "../database";
import { User } from "../types";

async function create_user(req, res) {
  if (true) {
    console.log(req.body);
    res.send({ sucess: false, error: "Failed to parse User obj" });
    return;
  }
  const user: User = { ...req.query };
  if (!user.first_name || !user.last_name || !user.email || !user.skill) {
    res.send({ success: false, error: "Missing required fields" });
  } else if ((await database.find_user_by_email(user.email)) != null) {
    res.send({ success: false, error: "User already exists" });
  }

  try {
    const result = await database.create_user(user);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Unknown Error" });
  }
}

// Register APIs
app.post("/api/users/create", create_user.bind(this));
