import express from "express";
import cors from "cors";
import path from "path";

import * as bodyParser from "body-parser";

export const app = express();
const port = process.env.PORT || 4000;

console.log("Launching Server...");

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../../frontend/build")));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.listen(port, () => console.log(`Server ready on port ${port}!`));

// Register APIs
import "./api/users";
import "./api/bracket";
import "./api/scores";

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});