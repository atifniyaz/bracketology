import { useEffect, useState } from "react";
import { Container, ContentHeading } from "./components/Common";
import { Table } from "./components/Tables";
import { Buffer } from "buffer";

async function get_scores() {
  return fetch("http://localhost:4000/api/scores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.response);
}

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    get_scores().then((data) => setScores(data));
  }, []);

  return (
    <Container>
      <ContentHeading>Scores</ContentHeading>
      <Table
        headings={["rank", "score", "name", "affiliation", "knowledge"]}
        rows={scores}
        rowGenerator={{
          name: (row: any) => (
            <a
              href={`/view?token=${Buffer.from(row.token, "utf-8").toString(
                "base64"
              )}`}
            >
              {row.name}
            </a>
          ),
        }}
        filters={["affiliation", "knowledge"]}
      />
    </Container>
  );
}

export default Scores;
