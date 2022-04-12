import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container, ContentHeading } from "./components/Common";
import * as Forms from "./components/Forms";

const LoginContainer = styled.div`
  padding: 4rem;
  width: 20rem;
  background: rgba(235, 235, 235, 1);

  @media (max-width: 706px) {
    width: -webkit-fill-available;
    box-shadow: 0px;
    padding: 2rem;
  }

  @media (min-width: 706px) {
    margin: auto;
  }
`;

const Header = styled.div`
  font-size: larger;
  text-align: left;
`;

const StatusText = styled.div`
  font-size: small;
  color: red;
`;

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

export default function BracketForm(props: any) {
  const navigate = useNavigate();
  const divisions = ["WEST", "EAST", "SOUTH", "MIDWEST"];

  const [options, setOptions] = useState<Array<any> | null>(null);
  const [bracket, setBracket] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("/api/get_master", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setBracket(data.master.selections);
        setOptions(data.teams);
      });
  }, []);

  const handleSubmit = () => {
    fetch("/api/bracket/update_master", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        bracket,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/");
        } else {
          alert("Failed to update!");
        }
      });
  };

  if (!options) {
    return (
      <Container>
        <Header>Loading...</Header>
      </Container>
    );
  }

  return (
    <LoginContainer>
      <Header>FILL OUT MASTER</Header>
      {divisions.map((division, i) => (
        <div key={i}>
          <ContentHeading>{division}</ContentHeading>
          {[...Array(16)].map((_, j) => (
            <Forms.GenericSelect
              key={j}
              value={
                bracket[`0 ${16 * i + j}`]
                  ? bracket[`0 ${16 * i + j}`]["id"]
                  : undefined
              }
              label={`TEAM ${indexToRank[j]}`}
              onChange={(v: any) => {
                setBracket({
                  ...bracket,
                  [`0 ${16 * i + j}`]: {
                    id: v,
                    rank: indexToRank[j],
                  },
                });
              }}
            >
              {options.map((option, i) => (
                <option key={i} value={option["id"]}>
                  {option["name"]}
                </option>
              ))}
            </Forms.GenericSelect>
          ))}
        </div>
      ))}
      <Forms.Submit label="SUBMIT" onSubmit={() => handleSubmit()} />
    </LoginContainer>
  );
}
