import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styled, { keyframes } from "styled-components";
import "./App.css";
import { Circle, PopupNotification } from "./components/Common";
import { useNavigate } from "react-router-dom";

const ROUND_TO_NAME: Record<number, string> = {
  0: "First Round",
  1: "Second Round",
  2: "Sweet Sixteen",
  3: "Elite Eight",
  4: "Final Four",
  5: "Championship",
};

function App() {
  const navigate = useNavigate();

  const maxGames = 8;
  const maxRounds = Math.log2(maxGames) + 1;

  const [stateMap, setStateMapNative] = useState<Record<string, any>>({});
  const setState = (round: number, index: number, value: any) => {
    const newMap: Record<string, any> = {
      ...stateMap,
      [`${round} ${index}`]: value,
    };

    while (true) {
      round = round + 1;
      index = Math.floor(index / 2);
      const key = `${round} ${index}`;
      if (!newMap[key]) {
        break;
      } else {
        delete newMap[key];
      }
    }

    setStateMapNative(newMap);
  };

  const getData = () => {
    if (stateMap.size === 0) {
      return;
    }
    const initMap: Record<string, any> = {};
    fetch("./teams.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        for (const teamVal of Object.entries(myJson)) {
          const team = teamVal as any;
          const { name, rank } = team[1];
          initMap[`0 ${team[0]}`] = {
            name,
            rank,
          };
        }
        setStateMapNative(initMap);
      })
      .catch((e) => {
        console.log(e);
        navigate("/error");
      });
  };

  const [message, setMessageNative] = useState<string>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [hidden, setHidden] = useState(true);

  const [round, setRoundNative] = useState(0);
  const setMessage = (message: string) => {
    setMessageNative(message);
    setHidden(false);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 500);
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  };
  const setRound = (value: number) => {
    if (value < 0) {
      return;
    }
    if (value >= maxRounds) {
      const filteredMap = {
        selections: [
          ...Object.entries(stateMap)
            .filter(([key, value]) => {
              return !key.includes("0 ");
            })
            .map(([key, value]) => {
              return {
                [key]: value,
              };
            }),
        ],
      };

      console.log(JSON.stringify(filteredMap));
      fetch("http://localhost:4000/api/users/bracket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(filteredMap),
      })
        .then(() => {
          navigate("/scores");
        })
        .catch((e) => {
          console.log(e);
        });
      return;
    }
    if (value < round) {
      setRoundNative(value);
      return;
    }
    const numSelected = Object.keys(stateMap).filter((key: any) =>
      key.includes(`${value} `)
    ).length;
    const totalGames = maxGames / Math.pow(2, round);
    if (numSelected === maxGames / Math.pow(2, round)) {
      setRoundNative(value);
    } else {
      const unselected = totalGames - numSelected;
      const plural = unselected === 1 ? "" : "s";
      setMessage(
        `Error! Winner${plural} ${
          unselected === 1 ? "was" : "were"
        } not selected for ${unselected} game${plural}!`
      );
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const totalGames = maxGames / Math.pow(2, round);
    const numSelected = Object.keys(stateMap).filter((key: any) =>
      key.includes(`${round + 1} `)
    ).length;
    if (numSelected === totalGames) {
      setRound(round + 1);
    } else {
      setMessage(
        `${round} ${totalGames} ${numSelected} Not all games have been selected!`
      );
    }
  }, [stateMap]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setRound(round + 1),
    onSwipedRight: () => setRound(round - 1),
  });

  if (stateMap.size === 0) {
    return <div>Loading...</div>;
  }

  return (
    <AppContainer>
      <Arrow
        left
        opacity={round > 0}
        onClick={() => {
          setRound(round - 1);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        <ArrowImg src={require("./ArrowLeft.png")} alt="Previous Round" />
      </Arrow>
      <BracketContent>
        <Bracket {...handlers}>
          {[...Array(2)].map((_, i) => {
            const roundIndex = round + i;
            if (roundIndex >= maxRounds) {
              return null;
            }
            return (
              <BracketRound>
                <Header>{ROUND_TO_NAME[roundIndex].toUpperCase()}</Header>
                {[...Array(maxGames / Math.pow(2, roundIndex))].map(
                  (_, index) => {
                    return (
                      <GameComponent
                        key={`${roundIndex} ${index}`}
                        round={roundIndex}
                        currRound={round}
                        index={index}
                        setState={setState}
                        stateMap={stateMap}
                      />
                    );
                  }
                )}
              </BracketRound>
            );
          })}
        </Bracket>
        <PopupNotification visible={popupVisible} hidden={hidden}>
          {message}
        </PopupNotification>
      </BracketContent>
      <Arrow
        left={false}
        opacity={round + 1 < maxRounds}
        onClick={() => {
          setRound(round + 1);
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        <ArrowImg src={require("./Arrow.png")} alt="Next Round" />
      </Arrow>
    </AppContainer>
  );
}

function GameComponent({
  round,
  currRound,
  index,
  setState,
  stateMap,
}: {
  round: number;
  currRound: number;
  index: number;
  setState: any;
  stateMap: Record<string, any>;
}) {
  const homeTeam = stateMap[`${round} ${index * 2}`];
  const awayTeam = stateMap[`${round} ${index * 2 + 1}`];

  const selectedTeam = stateMap[`${round + 1} ${index}`] ?? null;
  const [selected, setSelected] = useState<boolean | null>(null);

  return (
    <GameContainer round={round - currRound}>
      <TeamHeadline
        team={homeTeam}
        selected={selectedTeam === homeTeam}
        onSelected={() => {
          setState(round + 1, index, homeTeam);
          setSelected(true);
        }}
      />
      <TeamHeadline
        team={awayTeam}
        selected={selectedTeam === awayTeam}
        onSelected={() => {
          setState(round + 1, index, awayTeam);
          setSelected(false);
        }}
      />
    </GameContainer>
  );
}

function TeamHeadline({
  selected,
  onSelected,
  team,
}: {
  selected: boolean | null;
  onSelected: () => void;
  team: any;
}) {
  return (
    <TeamHeadlineContainer selected={selected} onClick={() => onSelected()}>
      <TeamRank>{team?.rank}</TeamRank>
      <TeamText>{team?.name}</TeamText>
      <Circle color={selected ? "blue" : "transparent"} />
    </TeamHeadlineContainer>
  );
}

type GameContainerProps = {
  round: number;
};

type TeamTextProps = {
  selected: boolean | null;
};

type ArrowProps = {
  left: boolean;
  opacity: boolean;
};

const GameContainer = styled.div<GameContainerProps>`
  @media only screen and (min-width: 600px) {
    width: 280px;
  }
  @media only screen and (max-width: 800px) {
    margin: ${(props) => `${16 + 66 * (Math.pow(2, props.round) - 1)}px 0px`};
  }
  width: 260px;
  background: rgba(255, 255, 255, 1);
  margin: ${(props) => `${16 + 56 * (Math.pow(2, props.round) - 1)}px 0px`};
  padding: 8px;
  border-radius: 10px;
  transition: all 1s linear;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const TeamHeadlineContainer = styled.div<TeamTextProps>`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
  align-items: end;
  border-radius: 10px;

  @media only screen and (max-width: 600px) {
    padding: 4px;
  }
`;

const TeamText = styled.div`
  font-size: 14px;
  margin: 4px 4px;
`;

const TeamRank = styled.div`
  font-size: 10px;
  margin: 5px 0;
`;

const Arrow = styled.div<ArrowProps>`
  display: flex;
  color: black;
  align-items: center;
  justify-content: center;
  top: 0px;
  left: ${(props) => (props.left ? "0px" : "50vw")};
  width: 15vw;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const ArrowImg = styled.img`
  position: fixed;
  top: 50vh;
  max-width: 30px;
  padding: 20px;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: rgb(235, 235, 235);
`;

const BracketContent = styled.div`
  width: 100vw;
  overflow: auto;
  @media only screen and (max-width: 600px) {
    max-width: 100vw;
  }
`;

const Bracket = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media only screen and (max-width: 920px) {
    justify-content: left;
  }
  overflow: hidden;
`;

const BracketRound = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  margin-bottom: 80px;
`;

const Details = styled.div`
  font-size: 10px;
  font-style: italic;
  text-align: left;
  margin-top: 12px;
`;

const Header = styled.div`
  margin-top: 24px;
  font-size: 16px;
  text-align: left;
  width: 100%;
`;

export default App;
