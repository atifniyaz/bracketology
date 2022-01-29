import express from "express";

import * as bodyParser from "body-parser";

export const app = express();
const port = process.env.PORT || 4000;

console.log("Launching Server...");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.listen(port, () => console.log(`Server ready on port ${port}!`));
