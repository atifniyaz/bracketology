import { app } from "../express";
import { database } from "../database";

const KNOWLEDGE: Record<string, string> = {
  "0": "None",
  "1": "Little",
  "2": "Moderate",
  "3": "Expert",
};

async function computeScores(brackets: Array<any>, master: any) {
  const rows = [];
  const roundToScore = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 4,
    "4": 6,
    "5": 8,
    "6": 10,
  };

  for (let i = 0; i < brackets.length; i++) {
    let score = 0;
    const bracket = brackets[i];
    if (bracket.token === "master") {
      continue;
    }

    const user = await database.find_user_by_email(bracket.token);
    const selections = bracket.selections;

    const selectionKeys = Object.keys(selections);

    for (const key of selectionKeys) {
      const selection = selections[key];
      const team = master.selections[key];

      const round = key.match(/\d+/)[0];

      if (!team) {
        continue;
      }
      if (selection.id === team.id) {
        score += roundToScore[round];
      }
    }

    rows.push({
      score,
      name: `${user.response.first_name} ${user.response.last_name}`,
      affiliation: user.response.affiliation,
      knowledge: KNOWLEDGE[user.response.knowledge],
      token: bracket.token,
    });
  }

  rows.sort((a, b) => b.score - a.score);
  let score: undefined | number = undefined;
  let rank = 1;

  for (let i = 0; i < rows.length; i++) {
    if (score === undefined) {
      score = rows[i].score;
    }
    if (score === rows[i].score) {
      rows[i].rank = rank;
    } else {
      rank = i + 1;
      rows[i].rank = rank;
    }
  }
  return rows;
}

async function scores(req, res) {
  const brackets = await database.get_brackets();
  const master = await database.get_master_bracket();

  if (brackets.success) {
    const rows = await computeScores(brackets.response, master.response);
    return res.status(200).send({
      success: true,
      response: rows,
    });
  }
  return res.status(200).send({
    success: false,
    response: [],
  });
}

// Register APIs
app.get("/api/scores", scores.bind(this));
