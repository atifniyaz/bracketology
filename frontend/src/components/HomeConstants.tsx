import { Content } from "./Common";

type PastWinnersProps = {
  year_raw: number;
  year: any;
  name: string;
  points?: number;
  knowledge?: string;
  bracket_link?: string;
};

export const ABOUT_TEXT = (
  <Content>
    Since 2004, the Carmel High School AP Statistics classes have collected data
    on brackets filled out for the NCAA Division I Men's Basketball Tournament.
    <br />
    <br />
    The objective of this project is to better understand the relationship
    between different variables on how well individuals are able to pick winners
    of tournament games. These variables include basketball knowledge, age, and
    gender.
    <br />
    <br />
    The data is then analyzed by students in the classes as a review assignment
    in preparation for their AP Exam.
  </Content>
);

export const SCORING = [
  {
    round: "First",
    score: 1,
  },
  {
    round: "Second",
    score: 2,
  },
  {
    round: "Sweet Sixteen",
    score: 4,
  },
  {
    round: "Elite Eight",
    score: 6,
  },
  {
    round: "Final Four",
    score: 8,
  },
  {
    round: "Championship",
    score: 10,
  },
];

export const PAST_WINNERS: Array<PastWinnersProps> = [
  {
    year_raw: 2022,
    year: (
      <a href="https://www.ncaa.com/brackets/print/basketball-men/d1/2022">
        2022
      </a>
    ),
    name: "Calvin Wendling",
    points: 91,
    knowledge: "Little",
  },
  {
    year_raw: 2021,
    year: (
      <a href="https://www.ncaa.com/brackets/print/basketball-men/d1/2021">
        2021
      </a>
    ),
    name: "Michael H. Wernke",
    points: 100,
    knowledge: "Moderate",
  },
  {
    year_raw: 2020,
    year: 2020,
    name: "Cancelled",
  },
  {
    year_raw: 2019,
    year: (
      <a href="https://www.ncaa.com/brackets/print/basketball-men/d1/2019">
        2019
      </a>
    ),
    name: "Graham Hatfield",
    points: 111,
    knowledge: "Moderate",
    bracket_link: "https://www.ncaa.com/brackets/print/basketball-men/d1/2019",
  },
  {
    year_raw: 2018,
    year: (
      <a href="https://www.ncaa.com/brackets/print/basketball-men/d1/2018">
        2018
      </a>
    ),
    name: "Mark Karr",
    points: 94,
    knowledge: "Moderate",
  },
  {
    year_raw: 2017,
    year: (
      <a href="https://www.ncaa.com/sites/default/files/public/files/NCAA-tournament-2017-bracket.jpg">
        2017
      </a>
    ),
    name: "Meagan Wernke",
    points: 107,
    knowledge: "Little",
  },
  {
    year_raw: 2016,
    year: (
      <a href="https://www.ncaa.com/sites/default/files/public/files/NCAA-tournament-2016-bracket.jpg">
        2016
      </a>
    ),
    name: "Kelly Wernke",
    points: 97,
    knowledge: "Little",
  },
  {
    year_raw: 2015,
    year: (
      <a href="https://www.ncaa.com/sites/default/files/public/files/NCAA-tournament-2015-bracket.jpg">
        2015
      </a>
    ),
    name: "Erica Arakawa",
    points: 111,
    knowledge: "None",
  },
  {
    year_raw: 2014,
    year: (
      <a href="https://www.ncaa.com/sites/default/files/public/files/NCAA-tournament-2014-bracket.jpg">
        2014
      </a>
    ),
    name: "Megana Rao",
    points: 75,
    knowledge: "Little",
  },
  {
    year_raw: 2013,
    year: (
      <a href="https://www.ncaa.com/sites/default/files/public/files/NCAA-tournament-2013-bracket.jpg">
        2013
      </a>
    ),
    name: "Loukas Sinnis",
    points: 88,
    knowledge: "Moderate",
  },
];
