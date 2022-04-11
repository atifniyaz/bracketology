import { app } from "../express";
import { database } from "../database";
import { User } from "../types";

async function create_user(req, res) {
  const { bracket: teamEntries } = req.body;

  const teams = await database.get_teams_collection().find({}).toArray();
  const idToTeams: Record<string, any> = {};
  for (const team of teams) {
    const teamEntry = Object.entries(team)[0][1];
    idToTeams[teamEntry["id"]] = {
      id: teamEntry["id"],
      name: teamEntry["displayName"],
      logo: teamEntry["logos"][0],
    };
  }

  const bracket: Record<string, any> = {};
  for (const team of Object.entries(teamEntries)) {
    const teamId = team[1]["id"];
    const key = team[0];
    const value = {
      ...idToTeams[teamId],
      rank: team[1]["rank"],
    };
    bracket[key] = value;
  }

  const response = {
    token: "master",
    selections: bracket,
  };

  database.get_bracket_collection().deleteMany({ token: "master" });
  database.get_bracket_collection().insertOne(response);
  console.log(response);

  res.status(200).send({
    success: true,
  });
}

// Register APIs
app.post("/api/bracket/update_master", create_user.bind(this));
