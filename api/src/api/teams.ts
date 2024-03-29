import request from "request";
import { database } from "../database";
import { app } from "../express";

let latest_scores = {};

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
  return res.json({
    master: await database
      .get_bracket_collection()
      .findOne({ token: "master" }),
    teams: team_names,
  });
}

async function get_scores_for_master(req, res) {
  const scores = await database.get_scores_collection().findOne();
  if (scores === null) {
    console.log("Warning! No scores found in database");
    return res.json(latest_scores);
  } else {
    return res.json(scores);
  }
}

export async function get_scores_for_master_native() {
  const master = Object.entries(
    (await database.get_master_bracket()).response.selections
  );

  const masterByKey = {};
  for (const entry of master) {
    masterByKey[entry[0]] = entry[1];
  }

  const queries = {};

  let round_index = 0;
  let game_index = 0;

  while (round_index < 6) {
    const home = masterByKey[`${round_index} ${game_index}`];
    const away = masterByKey[`${round_index} ${game_index + 1}`];
    if (!away) {
      continue;
    }

    queries[`${round_index} ${game_index}`] = {
      home: home["id"],
      away: away["id"],
      matchup: await find_matchup_native(home["id"], away["id"]),
    };

    game_index += 2;
    if (64 / Math.pow(2, round_index) <= game_index) {
      round_index++;
      game_index = 0;
    }
  }

  latest_scores = queries;
  database.get_scores_collection().deleteMany({});
  database.get_scores_collection().insertOne(queries);
}

async function find_matchups(req, res) {
  const { queries } = req.body;
  const response = {};
  for (const query of queries) {
    const { key, home, away } = query;
    response[key] = await find_matchup_native(home, away);
  }
  return res.json(response);
}

async function find_matchup(req, res) {
  const { home, away } = req.query;
  return res.json(await find_matchup_native(home, away));
}

async function find_matchup_native(home: string, away: string) {
  const url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${home}/schedule?region=us&lang=en&season=2022&seasontype=3`;

  const response = (await new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  })) as any;

  const matchups = response.events;
  if (!matchups) {
    return {
      sucess: false,
    };
  }

  for (const match of matchups) {
    const competition = match.competitions[0];
    if (
      (competition.competitors[0].team.id === away &&
        competition.competitors[1].team.id === home) ||
      (competition.competitors[0].team.id === home &&
        competition.competitors[1].team.id === away)
    ) {
      return {
        success: true,
        id: competition.id,
        home: competition.competitors[0].team.id,
        away: competition.competitors[1].team.id,
        score: {
          [home]: competition.competitors[0].score,
          [away]: competition.competitors[1].score,
        },
        clock: {
          time: competition.status.displayClock,
          period: competition.status.period,
          type: competition.status.type,
        },
      };
    }
  }

  return { success: false };
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
app.get("/api/teams/matchup", find_matchup.bind(this));
app.post("/api/teams/matchups", find_matchups.bind(this));
app.get("/api/get_master", get_team_names.bind(this));
app.get("/api/teams/generate", generate_init_bracket.bind(this));
app.get("/api/teams/scores", get_scores_for_master.bind(this));
