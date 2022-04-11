import { app } from "../express";
import { User } from "../types";
import fs from "fs";
import path from "path";
import { database } from "../database";

const tokens = [];

async function create(req, res) {
  const { user } = req.body;
  const alreadyUser = await database.find_user_by_email(user.email);

  if (alreadyUser.success) {
    return res.status(200).send({
      success: false,
      response: "User already exists!",
    });
  }

  database.create_user({
    ...user,
  });

  return res.status(200).send({
    access_token: user.email,
    user: user,
  });
}

async function auth(req, res) {
  const { token } = req.body;
  const user = await database.find_user_by_email(token);

  if (user.success) {
    return res.status(200).send({
      success: true,
      response: user.response,
    });
  } else {
    return res.status(200).send({
      success: false,
    });
  }
}

async function bracket_create(req, res) {
  const { token, selections } = req.body;
  await database.create_bracket(token, selections);

  return res.status(200).send({
    success: true,
  });
}

async function get_bracket(req, res) {
  const { token } = req.body;
  const user = await database.find_user_by_email(token);
  const bracket_two = await database.find_bracket_by_token(token);
  const master = await database.get_master_bracket();

  if (bracket_two.success) {
    return res.status(200).send({
      success: true,
      response: {
        user,
        bracket: bracket_two.response.selections,
        master: master.response.selections,
      },
    });
  }

  const bracket = require(path.join(__dirname, "../../teams.json"));
  return res.status(200).send({
    success: true,
    response: {
      bracket,
      master: master.response.selections ?? {},
    },
  });
}

// Register APIs
app.post("/api/users/create", create.bind(this));
app.post("/api/users/auth", auth.bind(this));
app.post("/api/users/bracket/create", bracket_create.bind(this));
app.post("/api/users/bracket/get", get_bracket.bind(this));
