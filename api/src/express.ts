import express from "express";
import path from "path";

export const app = express();
const port = process.env.PORT || 4000;

console.log("Launching Server...");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => console.log(`Server ready on port ${port}!`));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../../frontend/build")));

// Register APIs
import "./api/users";
import "./api/bracket";
import "./api/scores";
import "./api/teams";

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});
