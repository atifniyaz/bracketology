import request from "request";
import { database } from "../database";
import { app } from "../express";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

async function parse_team(teamParent) {
  return {
    [teamParent["team"]["id"]]: {
      ...teamParent["team"],
      logo: teamParent["team"]["logos"][0],
    },
  };
}

async function generate_init_bracket(req, res) {
  const teams = await database.get_teams_collection().find({}).toArray();
  shuffleArray(teams);

  const bracket: Record<string, any> = {};

  const indexToRank: Record<number, number> = {
    0: 1,
    1: 16,
    2: 8,
    3: 9,
    4: 5,
    5: 12,
    6: 4,
    7: 13,
    8: 6,
    9: 11,
    10: 3,
    11: 14,
    12: 7,
    13: 10,
    14: 2,
    15: 15,
  };

  for (let i = 0; i < 64; i++) {
    const team = teams[i];
    const teamEntry = Object.entries(team)[0][1];

    const key = `0 ${i}`;
    const value = {
      id: teamEntry["id"],
      name: teamEntry["displayName"],
      rank: String(indexToRank[i % 16]),
      logo: teamEntry["logos"][0],
    };

    bracket[key] = value;
  }

  database.get_bracket_collection().deleteMany({ token: "master" });
  database.get_bracket_collection().insertOne({
    token: "master",
    selections: bracket,
  });

  res.json(bracket);
}

async function get_team_names(req, res) {
  const teams = await database.get_teams_collection().find({}).toArray();

  const team_names = [];
  for (const team of teams) {
    const teamEntry = Object.entries(team)[0][1];
    team_names.push({
      id: teamEntry["id"],
      name: teamEntry["displayName"],
      logo: teamEntry["logos"][0],
    });
  }
  return res.json(team_names);
}

async function get_teams(req, res) {
  const url =
    "http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?groups=50&limit=1000";

  const response = (await new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  })) as any;

  const teams = response.sports[0].leagues[0].teams;
  const parsed_teams = await Promise.all(
    teams.map(async (team) => {
      return parse_team(team);
    })
  );

  database.get_teams_collection().deleteMany({});
  database.get_teams_collection().insertMany(parsed_teams);

  res.json({
    name: "NCAA Men's Basketball Teams",
    count: parsed_teams.length,
    teams: parsed_teams,
  });
}

app.get("/api/teams", get_teams.bind(this));
app.get("/api/teams/names", get_team_names.bind(this));
app.get("/api/teams/generate", generate_init_bracket.bind(this));
