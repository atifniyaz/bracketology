import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styled, { keyframes } from "styled-components";
import { Buffer } from "buffer";

import "./App.css";
import {
  Circle,
  Container,
  ContentHeading,
  PopupNotification,
} from "./components/Common";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "./components/Modal";
import { GenericInput } from "./components/Forms";

const ROUND_TO_NAME: Record<number, string> = {
  0: "First Round",
  1: "Second Round",
  2: "Sweet Sixteen",
  3: "Elite Eight",
  4: "Final Four",
  5: "Championship",
};

async function validateToken(token: string, setToken: any, setMessage: any) {
  fetch("/api/users/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((res) => {
      const { success } = res;
      if (success) {
        setToken(token);
      } else {
        setMessage("Invalid token!");
      }
    });
}

async function onSubmitBracket(
  stateMap: Record<string, any>,
  navigate: any,
  token: string
) {
  const body = {
    token,
    selections: stateMap,
  };

  fetch("/api/users/bracket/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  })
    .then(() => {
      navigate("/scores");
    })
    .catch((e) => {
      console.log(e);
    });
}

function parseBracketResponse(bracket: any) {
  const initMap: Record<string, any> = {};
  for (const teamVal of Object.entries(bracket)) {
    const team = teamVal as any;
    initMap[team[0]] = team[1];
  }
  return initMap;
}

function App({ viewOnly }: { viewOnly?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const queryToken = searchParams.get("token");
  let decodedToken: string | null = null;
  if (queryToken !== null) {
    try {
      const buffer = Buffer.from(queryToken, "base64");
      decodedToken = buffer.toString("utf-8");
    } catch (e) {}
  }

  const [token, setToken] = useState<string | null>(
    (location.state as any)?.token || (viewOnly && decodedToken)
  );

  const maxGames = 8;
  const maxRounds = Math.log2(maxGames) + 1;

  const [stateMap, setStateMapNative] = useState<Record<string, any>>({});
  const [masterMap, setMasterMap] = useState<Record<string, any>>({});

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

  const getData = (token: string | null) => {
    if (Object.keys(stateMap).length !== 0 || !token) {
      return;
    }
    fetch("/api/users/bracket/get", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        if (myJson.response.user) {
          navigate({
            pathname: "/view",
            search: `?token=${Buffer.from(token).toString("base64")}`,
          });
        }
        setStateMapNative(parseBracketResponse(myJson.response.bracket));
        setMasterMap(parseBracketResponse(myJson.response.master));
      })
      .catch((e) => {
        console.log(e);
        setStateMapNative({});
        setMessage(e.message);
      });
  };

  const [message, setMessageNative] = useState<string>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    if (value < 0 || (value >= maxRounds && viewOnly)) {
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
    if (
      token === "master" ||
      viewOnly ||
      numSelected === maxGames / Math.pow(2, round)
    ) {
      if (value >= maxRounds) {
        setShowModal(true);
      } else {
        setRoundNative(value);
      }
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
    getData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setRound(round + 1),
    onSwipedRight: () => setRound(round - 1),
  });

  let inputTimeout: NodeJS.Timeout;

  if (!token) {
    return (
      <>
        <PopupNotification visible={popupVisible} hidden={hidden}>
          {message}
        </PopupNotification>
        <Modal
          title="Please enter your access token"
          submitText="Register"
          onSubmit={() => navigate("/register")}
          onCancel={() => navigate("/")}
        >
          <GenericInput
            label="ACCESS TOKEN"
            onChange={(text: string) => {
              clearTimeout(inputTimeout);
              inputTimeout = setTimeout(() => {
                validateToken(text, setToken, setMessage);
              }, 1000);
            }}
          />
          <p>
            Once you enter in your access token, the page will automatically
            refresh.
            <br />
            <br />
            Don't have an access token? Click below to register.
          </p>
        </Modal>
      </>
    );
  }
  if (Object.keys(stateMap).length === 0) {
    return <Modal title="Loading..." />;
  }

  return (
    <AppContainer>
      {showModal && (
        <Modal
          title="Are you sure you want to submit?"
          onSubmit={() => {
            setShowModal(false);
            onSubmitBracket(stateMap, navigate, token);
          }}
          onCancel={() => setShowModal(false)}
        ></Modal>
      )}
      <Arrow
        left
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
                        masterMap={masterMap}
                        viewOnly={viewOnly ?? true}
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
  masterMap,
  viewOnly,
}: {
  round: number;
  currRound: number;
  index: number;
  setState: any;
  stateMap: Record<string, any>;
  masterMap: Record<string, any>;
  viewOnly: boolean;
}) {
  const homeTeam = stateMap[`${round} ${index * 2}`];
  const awayTeam = stateMap[`${round} ${index * 2 + 1}`];

  const masterHome = masterMap[`${round} ${index * 2}`];
  const masterAway = masterMap[`${round} ${index * 2 + 1}`];

  const selectedTeam = stateMap[`${round + 1} ${index}`] ?? null;
  const [selected, setSelected] = useState<boolean | null>(null);

  const homeColor =
    masterHome && homeTeam && round > 0
      ? masterHome.id === homeTeam.id
        ? "green"
        : "red"
      : "black";
  const awayColor =
    masterAway && awayTeam && round > 0
      ? masterAway.id === awayTeam.id
        ? "green"
        : "red"
      : "black";

  return (
    <GameContainer round={round - currRound} viewOnly={viewOnly}>
      <MasterHeadlineContainer bottom={false}>
        {round > 0 && masterHome?.name}
      </MasterHeadlineContainer>
      <TeamHeadline
        team={homeTeam}
        selected={selectedTeam && selectedTeam?.id === homeTeam?.id}
        color={homeColor}
        onSelected={() => {
          setState(round + 1, index, homeTeam);
          setSelected(true);
        }}
      />
      <TeamHeadline
        team={awayTeam}
        selected={selectedTeam && selectedTeam?.id === awayTeam?.id}
        color={awayColor}
        onSelected={() => {
          setState(round + 1, index, awayTeam);
          setSelected(false);
        }}
      />
      <MasterHeadlineContainer bottom={true}>
        {round > 0 && masterAway?.name}
      </MasterHeadlineContainer>
    </GameContainer>
  );
}

function TeamHeadline({
  selected,
  onSelected,
  team,
  color,
}: {
  selected: boolean | null;
  onSelected: () => void;
  team: any;
  color: string;
}) {
  return (
    <TeamHeadlineContainer
      selected={selected}
      textColor={color}
      onClick={() => onSelected()}
    >
      <TeamRank>{team?.rank}</TeamRank>
      <TeamText>{team?.name}</TeamText>
      <Circle color={selected ? "blue" : "transparent"} />
    </TeamHeadlineContainer>
  );
}

type GameContainerProps = {
  round: number;
  viewOnly: boolean;
};

type TeamTextProps = {
  selected: boolean | null;
  textColor: string;
};

type ArrowProps = {
  left: boolean;
};

const GameContainer = styled.div<GameContainerProps>`
  @media only screen and (min-width: 600px) {
    width: 280px;
  }
  @media only screen and (max-width: 600px) {
    margin: ${(props) => `${16 + 76 * (Math.pow(2, props.round) - 1)}px 0px`};
  }
  width: 260px;
  background: rgba(255, 255, 255, 1);
  margin: ${(props) => `${16 + 68 * (Math.pow(2, props.round) - 1)}px 0px`};
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  pointer-events: ${(props) => (props.viewOnly ? "none" : "unset")};
`;

const TeamHeadlineContainer = styled.div<TeamTextProps>`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
  align-items: end;
  border-radius: 10px;
  padding: 0px 8px;
  color: ${(props) => (props.textColor ? props.textColor : "black")};

  @media only screen and (max-width: 600px) {
    padding: 4px 8px;
  }
`;

const MasterHeadlineContainer = styled.div<{ bottom: boolean }>`
  font-size: 10px;
  padding: 0px 16px;
  height: 12px;
  background: #eee;
  padding: 4px 16px;
  border-radius: ${(props) =>
    props.bottom ? "0px 0px 10px 10px" : "10px 10px 0px 0px"};
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
